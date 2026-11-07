import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { favorites, restaurants } from "@/lib/db/schema";
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

export async function getMyFavorites() {
  const user = await getCurrentUser();
  if (!user) return [];
  return getFavoritesByUserId(user.id);
}

async function getFavoritesByUserId(userId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`favorites:${userId}`, "restaurants");
  const rows = await db
    .select({ restaurant: restaurants })
    .from(favorites)
    .innerJoin(restaurants, eq(favorites.restaurantId, restaurants.id))
    .where(
      and(eq(favorites.userId, userId), eq(restaurants.status, "approved")),
    )
    .orderBy(desc(favorites.createdAt));

  return rows.map((row) => row.restaurant);
}
