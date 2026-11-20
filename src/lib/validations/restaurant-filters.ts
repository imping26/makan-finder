import { z } from "zod";
import { CUISINES, MALAYSIAN_STATES } from "@/lib/db/schema";
import type { RestaurantFilters } from "@/lib/queries/restaurants";

type SearchParams = Record<string, string | string[] | undefined>;

function param<T extends z.ZodType>(schema: T) {
  return z
    .preprocess((value) => {
      const first = Array.isArray(value) ? value[0] : value;
      return first === "" ? undefined : first;
    }, schema.optional())
    .catch(undefined);
}

const restaurantFiltersSchema = z.object({
  state: param(z.enum(MALAYSIAN_STATES)),
  cuisine: param(z.enum(CUISINES)),
  priceRange: param(
    z.coerce.number().pipe(z.union([z.literal(1), z.literal(2), z.literal(3)])),
  ),
  halal: param(z.stringbool()),
  q: param(z.string().trim().max(100)),
  page: param(z.coerce.number().int().positive()),
});

export function parseRestaurantFilters(
  searchParams: SearchParams,
): RestaurantFilters {
  return restaurantFiltersSchema.parse(searchParams);
}

export function filtersToSearchParams(filters: RestaurantFilters): string {
  const params = new URLSearchParams();
  if (filters.state) params.set("state", filters.state);
  if (filters.cuisine) params.set("cuisine", filters.cuisine);
  if (filters.priceRange) params.set("priceRange", String(filters.priceRange));
  if (filters.halal) params.set("halal", "on");
  if (filters.q) params.set("q", filters.q);
  return params.toString();
}
