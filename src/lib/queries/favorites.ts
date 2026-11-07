import "server-only";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function getIsFavorited(restaurantId: string) {
  const user = await getCurrentUser();
  if (!user) return false;

  const row = await db.query.favorites.findFirst({
    where: (f, { and, eq }) =>
      and(eq(f.restaurantId, restaurantId), eq(f.userId, user.id)),
    columns: { restaurantId: true },
  });

  return row !== undefined;
}
