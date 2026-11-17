"use server";

import { and, eq } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import { db } from "@/lib/db";
import { restaurants } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/session";
import { reviewSubmissionSchema } from "@/lib/validations/restaurant";

async function setRestaurantStatus(
  restaurantId: string,
  status: "approved" | "rejected",
) {
  const [row] = await db
    .update(restaurants)
    .set({ status, updatedAt: new Date() })
    .where(
      and(eq(restaurants.id, restaurantId), eq(restaurants.status, "pending")),
    )
    .returning({ slug: restaurants.slug });

  return row ?? null;
}

export async function reviewSubmission(formData: FormData): Promise<void> {
  const parsed = reviewSubmissionSchema.safeParse({
    restaurantId: formData.get("restaurantId"),
    intent: formData.get("intent"),
  });
  if (!parsed.success) {
    throw new Error("Invalid request");
  }

  const user = await getCurrentUser();

  if (user?.role !== "admin") {
    throw new Error("Forbidden");
  }

  const data = parsed.data;

  const row = await setRestaurantStatus(
    data.restaurantId,
    data.intent === "approve" ? "approved" : "rejected",
  );

  if (!row) {
    refresh();
    return;
  }
  if (data.intent === "reject") {
    refresh();
    return;
  }

  updateTag("restaurants");
  updateTag("allRestaurantsSlug");
  updateTag(`restaurant:${row.slug}`);
}
