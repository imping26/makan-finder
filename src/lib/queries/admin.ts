import "server-only";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function getPendingRestaurants() {
  const user = await getCurrentUser();
  if (user?.role !== "admin") return [];

  return db.query.restaurants.findMany({
    where: (r, { eq }) => eq(r.status, "pending"),
    orderBy: (r, { asc }) => [asc(r.createdAt)],
    columns: {
      id: true,
      name: true,
      description: true,
      state: true,
      city: true,
      address: true,
      cuisine: true,
      priceRange: true,
      isHalal: true,
      createdAt: true,
    },
    with: { creator: { columns: { name: true } } },
  });
}

export type PendingRestaurant = Awaited<
  ReturnType<typeof getPendingRestaurants>
>[number];
