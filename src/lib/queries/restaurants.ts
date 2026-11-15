import "server-only";
import { and, asc, count, desc, eq, ilike, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  restaurants,
  type Cuisine,
  type MalaysianState,
  type Restaurant,
} from "@/lib/db/schema";
import { cacheLife, cacheTag } from "next/cache";

export const PAGE_SIZE = 12;

export type RestaurantFilters = {
  state?: MalaysianState;
  cuisine?: Cuisine;
  priceRange?: 1 | 2 | 3;
  halal?: boolean;
  q?: string;
  page?: number;
};

export async function getRestaurants(filters: RestaurantFilters = {}) {
  "use cache";
  cacheLife("hours");
  cacheTag("restaurants");
  const page = Math.max(1, filters.page ?? 1);

  const conditions: SQL[] = [eq(restaurants.status, "approved")];
  if (filters.state) conditions.push(eq(restaurants.state, filters.state));
  if (filters.cuisine)
    conditions.push(eq(restaurants.cuisine, filters.cuisine));
  if (filters.priceRange)
    conditions.push(eq(restaurants.priceRange, filters.priceRange));
  if (filters.halal !== undefined)
    conditions.push(eq(restaurants.isHalal, filters.halal));

  const q = filters.q?.trim();
  if (q) {
    const escaped = q.replace(/[\\%_]/g, "\\$&");
    conditions.push(ilike(restaurants.name, `%${escaped}%`));
  }

  const where = and(...conditions);

  const [items, [{ total }]] = await Promise.all([
    db
      .select()
      .from(restaurants)
      .where(where)
      .orderBy(
        desc(restaurants.avgRating),
        desc(restaurants.reviewCount),
        asc(restaurants.id),
      )
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(restaurants).where(where),
  ]);

  return {
    items,
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getRestaurantBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`restaurant:${slug}`);
  const restaurant = await db.query.restaurants.findFirst({
    where: (r, { and, eq }) => and(eq(r.slug, slug), eq(r.status, "approved")),
  });

  return restaurant ?? null;
}

export async function getPopularRestaurants(limit = 6): Promise<Restaurant[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("restaurants");

  return db
    .select()
    .from(restaurants)
    .where(eq(restaurants.status, "approved"))
    .orderBy(
      desc(restaurants.avgRating),
      desc(restaurants.reviewCount),
      asc(restaurants.id),
    )
    .limit(limit);
}

export async function getAllRestaurantSlugs() {
  "use cache";
  cacheLife("hours");
  cacheTag("allRestaurantsSlug");

  return db
    .select({ slug: restaurants.slug })
    .from(restaurants)
    .where(eq(restaurants.status, "approved"));
}

export type RestaurantListResult = Awaited<ReturnType<typeof getRestaurants>>;
export type RestaurantDetail = NonNullable<
  Awaited<ReturnType<typeof getRestaurantBySlug>>
>;
