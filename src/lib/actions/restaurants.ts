"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { restaurants } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/session";
import { slugify } from "@/lib/slug";
import {
  restaurantSubmissionSchema,
  type RestaurantSubmission,
  type SubmitRestaurantState,
} from "@/lib/validations/restaurant";

const RESERVED_SLUGS = new Set(["new"]);

async function insertPendingRestaurant(
  data: RestaurantSubmission,
  userId: string,
) {
  let base = slugify(data.name) || "restaurant";
  if (RESERVED_SLUGS.has(base)) base = `${base}-restaurant`;

  for (let attempt = 1; attempt <= 20; attempt++) {
    const slug = attempt === 1 ? base : `${base}-${attempt}`;
    const [row] = await db
      .insert(restaurants)
      .values({
        ...data,
        slug,
        status: "pending",
        createdBy: userId,
      })
      .onConflictDoNothing({ target: restaurants.slug })
      .returning({ id: restaurants.id, slug: restaurants.slug });
    if (row) return row;
  }

  throw new Error(`No free slug for "${data.name}"`);
}

export async function submitRestaurant(
  _prevState: SubmitRestaurantState,
  formData: FormData,
): Promise<SubmitRestaurantState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    state: String(formData.get("state") ?? ""),
    city: String(formData.get("city") ?? ""),
    address: String(formData.get("address") ?? ""),
    cuisine: String(formData.get("cuisine") ?? ""),
    priceRange: String(formData.get("priceRange") ?? ""),
    isHalal: formData.get("isHalal") === "on" ? "on" : "",
  };

  const parsed = restaurantSubmissionSchema.safeParse({
    ...values,
    isHalal: values.isHalal === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  const user = await getCurrentUser();
  if (!user)
    return {
      status: "error",
      message: "Please sign in to submit a restaurant.",
      values,
    };

  try {
    await insertPendingRestaurant(parsed.data, user.id);
  } catch (e) {
    console.error(e);
    return {
      status: "error",
      message: "Couldn't submit right now. Please try again.",
      values,
    };
  }

  redirect("/dashboard?submitted=1");
}
