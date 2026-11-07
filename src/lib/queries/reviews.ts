import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
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
