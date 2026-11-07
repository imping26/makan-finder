"use server";

import { and, eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { favorites, restaurants } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/session";

export type FavoriteResult = { ok: true } | { ok: false; message: string };

const setFavoriteSchema = z.object({
  restaurantId: z.uuid(),
  favorite: z.boolean(),
});

export async function setFavorite(
  restaurantId: string,
  favorite: boolean,
): Promise<FavoriteResult> {
  const safeParsed = setFavoriteSchema.safeParse({ restaurantId, favorite });
  if (!safeParsed.success) {
    return { ok: false, message: "Something went wrong." };
  }

  const parsed = safeParsed.data;

  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Please sign in to save favourites." };
  }

  try {
    if (parsed.favorite) {
      const [restaurant] = await db
        .select({ id: restaurants.id })
        .from(restaurants)
        .where(
          and(
            eq(restaurants.id, parsed.restaurantId),
            eq(restaurants.status, "approved"),
          ),
        );
      if (!restaurant) {
        return { ok: false, message: "This restaurant isn't available." };
      }

      await db
        .insert(favorites)
        .values({ userId: user.id, restaurantId: parsed.restaurantId })
        .onConflictDoNothing();
    } else {
      await db
        .delete(favorites)
        .where(
          and(
            eq(favorites.userId, user.id),
            eq(favorites.restaurantId, parsed.restaurantId),
          ),
        );
    }
  } catch (error) {
    console.error("setFavorite failed", error);
    return { ok: false, message: "Couldn't update your favourites." };
  }

  refresh();
  return { ok: true };
}
