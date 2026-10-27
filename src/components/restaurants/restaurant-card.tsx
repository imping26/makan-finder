import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import type { Restaurant } from "@/lib/db/schema";
import { formatPriceRange, formatSlugLabel } from "@/lib/format";

type RestaurantCardProps = {
  restaurant: Pick<
    Restaurant,
    | "slug"
    | "name"
    | "cuisine"
    | "city"
    | "state"
    | "priceRange"
    | "isHalal"
    | "avgRating"
    | "reviewCount"
  >;
};

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link
      href={`/restaurants/${restaurant.slug}`}
      className="group flex flex-col gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold leading-tight group-hover:underline">
          {restaurant.name}
        </h2>
        {restaurant.isHalal && (
          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            Halal
          </span>
        )}
      </div>

      <p className="flex items-center gap-1 text-sm text-muted-foreground">
        <MapPin className="size-3.5" />
        {restaurant.city}, {formatSlugLabel(restaurant.state)}
      </p>

      <div className="mt-auto flex items-center gap-3 text-sm">
        <span className="flex items-center gap-1">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          {restaurant.avgRating.toFixed(1)}
          <span className="text-muted-foreground">
            ({restaurant.reviewCount})
          </span>
        </span>
        <span className="text-muted-foreground">
          {formatSlugLabel(restaurant.cuisine)}
        </span>
        <span className="ml-auto text-muted-foreground">
          {formatPriceRange(restaurant.priceRange)}
        </span>
      </div>
    </Link>
  );
}
