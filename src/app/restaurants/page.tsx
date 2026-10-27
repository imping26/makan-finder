import { RestaurantCard } from "@/components/restaurants/restaurant-card";
import { getRestaurants } from "@/lib/queries/restaurants";
import { Suspense } from "react";

export default function RestaurantsPage({
  searchParams,
}: PageProps<"/restaurants">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Restaurants</h1>

      <Suspense fallback={<p>Loading…</p>}>
        <RestaurantGrid searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function RestaurantGrid({
  searchParams,
}: Pick<PageProps<"/restaurants">, "searchParams">) {
  const allSearchParams = await searchParams;
  const rawPage = allSearchParams.page;
  const pageStr = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const parsed = Number(pageStr);
  const page = Number.isInteger(parsed) && parsed > 0 ? parsed : 1;

  const { items, total, pageCount } = await getRestaurants({ page });

  if (items.length === 0) {
    return <p className="text-muted-foreground">No restaurants found.</p>;
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
    </>
  );
}
