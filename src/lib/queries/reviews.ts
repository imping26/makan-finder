import "server-only";
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
