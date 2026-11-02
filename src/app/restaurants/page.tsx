import {
  FilterBar,
  FilterBarSkeleton,
} from "@/components/restaurants/filter-bar";
import { Pagination } from "@/components/restaurants/pagination";
import { RestaurantCard } from "@/components/restaurants/restaurant-card";
import { RestaurantGridSkeleton } from "@/components/restaurants/restaurant-grid-skeleton";
import {
  getRestaurants,
  PAGE_SIZE,
  type RestaurantFilters,
} from "@/lib/queries/restaurants";
import { parseRestaurantFilters } from "@/lib/validations/restaurant-filters";
import Link from "next/link";
import { Suspense } from "react";

export default function RestaurantsPage({
  searchParams,
}: PageProps<"/restaurants">) {
  const filtersPromise = searchParams.then(parseRestaurantFilters);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Restaurants</h1>

      <Suspense fallback={<FilterBarSkeleton />}>
        <FilterBar filtersPromise={filtersPromise} />
      </Suspense>

      <Suspense fallback={<RestaurantGridSkeleton count={PAGE_SIZE} />}>
        <RestaurantGrid filtersPromise={filtersPromise} />
      </Suspense>
    </div>
  );
}

async function RestaurantGrid({
  filtersPromise,
}: {
  filtersPromise: Promise<RestaurantFilters>;
}) {
  const filters = await filtersPromise;
  const { items, total, page, pageCount } = await getRestaurants(filters);

  if (total === 0) {
    return <p className="text-muted-foreground">No restaurants found.</p>;
  }

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground">
        Page {page} doesn&apos;t exist.{" "}
        <Link href="/restaurants" className="underline">
          Back to page 1
        </Link>
      </p>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        {total} restaurants · page {page} of {pageCount}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>

      <Pagination page={page} pageCount={pageCount} filters={filters} />
    </>
  );
}
