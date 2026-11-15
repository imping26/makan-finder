"use server";

import { and, avg, count, eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { restaurants, reviews } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/session";
import { reviewSchema, type ReviewFormState } from "@/lib/validations/review";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function recalculateRating(tx: Tx, restaurantId: string) {
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
}

export async function submitReview(
  prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  return formData.get("intent") === "delete"
    ? deleteReview(prevState, formData)
    : saveReview(prevState, formData);
}

async function saveReview(
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

  let slug: string | null;
  try {
    slug = await db.transaction(async (tx) => {
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

      await recalculateRating(tx, restaurantId);
      return restaurant.slug;
    });
  } catch (error) {
    console.error("saveReview failed", error);
    return {
      status: "error",
      message: "Couldn't save your review. Please try again.",
      values: submitted,
    };
  }

  if (!slug) {
    return {
      status: "error",
      message: "This restaurant isn't open for reviews.",
      values: submitted,
    };
  }

  updateTag(`restaurant:${slug}`);
  updateTag("restaurants");
  updateTag(`reviews:${user.id}`);

  return {
    status: "success",
    message: "Review saved",
    values: { rating, content },
  };
}

async function deleteReview(
  _prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const parsed = z.uuid().safeParse(formData.get("restaurantId"));

  if (!parsed.success) {
    return { status: "error", message: "Something went wrong." };
  }

  const restaurantId = parsed.data;

  const user = await getCurrentUser();

  if (!user) {
    return {
      status: "error",
      message: "Please sign in to delete your review.",
    };
  }

  let slug: string | null;
  try {
    slug = await db.transaction(async (tx) => {
      const [deleted] = await tx
        .delete(reviews)
        .where(
          and(
            eq(reviews.restaurantId, restaurantId),
            eq(reviews.userId, user.id),
          ),
        )
        .returning({ id: reviews.id });
      if (!deleted) return null;

      await recalculateRating(tx, restaurantId);

      const [restaurant] = await tx
        .select({ slug: restaurants.slug })
        .from(restaurants)
        .where(eq(restaurants.id, restaurantId));
      return restaurant?.slug ?? null;
    });
  } catch (error) {
    console.error("deleteReview failed", error);
    return {
      status: "error",
      message: "Couldn't delete your review. Please try again.",
    };
  }

  if (!slug) {
    return {
      status: "error",
      message: "There's no review of yours to delete.",
    };
  }

  updateTag(`restaurant:${slug}`);
  updateTag("restaurants");
  updateTag(`reviews:${user.id}`);

  return {
    status: "success",
    message: "Review deleted",
    values: { rating: 0, content: "" },
  };
}
