import "server-only";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { cache } from "react";
import { db } from "@/lib/db";
import { restaurants } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/session";

export async function getMyReview(restaurantId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const review = await db.query.reviews.findFirst({
    where: (r, { and, eq }) =>
      and(eq(r.restaurantId, restaurantId), eq(r.userId, user.id)),
    columns: { rating: true, content: true },
  });
  return review ?? null;
}

export async function getMyReviews() {
  const user = await getCurrentUser();
  if (!user) return [];
  return getReviewsByUserId(user.id);
}

async function getReviewsByUserId(userId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`reviews:${userId}`);
  return db.query.reviews.findMany({
    where: (r, { eq }) => eq(r.userId, userId),
    orderBy: (r, { desc }) => [desc(r.updatedAt)],
    columns: { id: true, rating: true, content: true, updatedAt: true },
    with: { restaurant: { columns: { name: true, slug: true } } },
  });
}

export type MyReview = Awaited<ReturnType<typeof getMyReviews>>[number];

export const getRestaurantReviews = cache(async (restaurantId: string) => {
  await connection();

  const [stats, reviews] = await Promise.all([
    db
      .select({
        avgRating: restaurants.avgRating,
        reviewCount: restaurants.reviewCount,
      })
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId))
      .then(([row]) => row ?? { avgRating: 0, reviewCount: 0 }),
    db.query.reviews.findMany({
      where: (r, { eq }) => eq(r.restaurantId, restaurantId),
      orderBy: (r, { desc }) => [desc(r.createdAt)],
      with: { user: { columns: { name: true, image: true } } },
    }),
  ]);

  return { ...stats, reviews };
});

export type RestaurantReview = Awaited<
  ReturnType<typeof getRestaurantReviews>
>["reviews"][number];
