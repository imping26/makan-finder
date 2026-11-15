import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { RestaurantCard } from "@/components/restaurants/restaurant-card";
import { Button } from "@/components/ui/button";
import { CUISINES, MALAYSIAN_STATES } from "@/lib/db/schema";
import { formatSlugLabel } from "@/lib/format";
import { getPopularRestaurants } from "@/lib/queries/restaurants";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-12">
      <section className="flex flex-col items-start gap-4">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Find your next makan spot
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Nasi lemak, char kuey teow, roti canai and more — browse Malaysian
          restaurants by state, cuisine, price and halal status.
        </p>
        <Button asChild size="lg">
          <Link href="/restaurants">
            Browse all restaurants
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </section>

      <PopularRestaurants />

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Browse by state</h2>
        <ul className="flex flex-wrap gap-2">
          {MALAYSIAN_STATES.map((state) => (
            <li key={state}>
              <Button asChild variant="outline" size="sm">
                <Link href={`/restaurants?state=${state}`}>
                  {formatSlugLabel(state)}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Browse by cuisine</h2>
        <ul className="flex flex-wrap gap-2">
          {CUISINES.map((cuisine) => (
            <li key={cuisine}>
              <Button asChild variant="outline" size="sm">
                <Link href={`/restaurants?cuisine=${cuisine}`}>
                  {formatSlugLabel(cuisine)}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

async function PopularRestaurants() {
  const popular: Awaited<ReturnType<typeof getPopularRestaurants>> =
    await getPopularRestaurants();

  if (popular.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold">Top rated</h2>
        <Link
          href="/restaurants"
          className="text-sm text-muted-foreground hover:underline"
        >
          See all
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {popular.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </section>
  );
}
