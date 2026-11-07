"use server";

import { and, avg, count, eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { restaurants, reviews } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/session";
import { reviewSchema, type ReviewFormState } from "@/lib/validations/review";

export async function saveReview(
  _prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const raw = {
    restaurantId: formData.get("restaurantId"),
    rating: formData.get("rating"),
    content: formData.get("content"),
  };
  const submitted = {
    rating: Number(raw.rating) || 0,
    content: typeof raw.content === "string" ? raw.content : "",
  };

  const parsed = reviewSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values: submitted,
    };
  }

  const { restaurantId, rating, content } = parsed.data;

  const user = await getCurrentUser();

  if (!user?.id) {
    return {
      status: "error",
      message: "Please sign in",
      values: submitted,
    };
  }

  const slug = await db.transaction(async (tx) => {
    const [restaurant] = await tx
      .select({ slug: restaurants.slug })
      .from(restaurants)
      .where(
        and(
          eq(restaurants.id, restaurantId),
          eq(restaurants.status, "approved"),
        ),
      );
    if (!restaurant) return null;

    await tx
      .insert(reviews)
      .values({ restaurantId, userId: user.id, rating, content })
      .onConflictDoUpdate({
        target: [reviews.restaurantId, reviews.userId],
        set: { rating, content, updatedAt: new Date() },
      });

    const [stats] = await tx
      .select({ avgRating: avg(reviews.rating), reviewCount: count() })
      .from(reviews)
      .where(eq(reviews.restaurantId, restaurantId));

    await tx
      .update(restaurants)
      .set({
        avgRating: Number(stats?.avgRating ?? 0),
        reviewCount: stats?.reviewCount ?? 0,
      })
      .where(eq(restaurants.id, restaurantId));

    return restaurant.slug;
  });

  if (!slug) {
    return {
      status: "error",
      message: "This restaurant isn't open for reviews.",
      values: submitted,
    };
  }

  updateTag(`restaurant:${slug}`);
  updateTag("restaurants");

  return {
    status: "success",
    message: "Review saved",
    values: { rating, content },
  };
}
