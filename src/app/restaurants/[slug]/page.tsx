import { Suspense } from "react";
import { RestaurantDetailsSkeleton } from "@/components/restaurants/restaurant-details-skeleton";
import Link from "next/link";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { OpeningHours } from "@/components/restaurants/opening-hours";
import { ReviewList } from "@/components/restaurants/review-list";
import { formatPriceRange, formatSlugLabel, truncate } from "@/lib/format";
import {
  getAllRestaurantSlugs,
  getRestaurantBySlug,
} from "@/lib/queries/restaurants";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ReviewFormSection,
  ReviewFormSkeleton,
} from "@/components/restaurants/review-form-section";
import {
  FavoriteSection,
  FavoriteSkeleton,
} from "@/components/restaurants/favorite-section";

export async function generateStaticParams() {
  return getAllRestaurantSlugs();
}

export async function generateMetadata({
  params,
}: PageProps<"/restaurants/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) return { title: "Restaurant not found" };

  return {
    title: restaurant.name,
    description: truncate(restaurant.description, 155),
    alternates: { canonical: `/restaurants/${slug}` },
  };
}

export default function RestaurantPage({
  params,
}: PageProps<"/restaurants/[slug]">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/restaurants"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All restaurants
      </Link>

      <Suspense fallback={<RestaurantDetailsSkeleton />}>
        <RestaurantDetails params={params} />
      </Suspense>
    </div>
  );
}

async function RestaurantDetails({
  params,
}: Pick<PageProps<"/restaurants/[slug]">, "params">) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) return notFound();

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          {restaurant.isHalal && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              Halal
            </span>
          )}
          <div className="ml-auto">
            <Suspense fallback={<FavoriteSkeleton />}>
              <FavoriteSection
                restaurantId={restaurant.id}
                slug={restaurant.slug}
              />
            </Suspense>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="text-foreground">
              {restaurant.avgRating.toFixed(1)}
            </span>
            ({restaurant.reviewCount} reviews)
          </span>
          <span>{formatSlugLabel(restaurant.cuisine)}</span>
          <span>{formatPriceRange(restaurant.priceRange)}</span>
          <span className="flex items-center gap-1">
            <MapPin className="size-4" />
            {restaurant.address}, {restaurant.city},{" "}
            {formatSlugLabel(restaurant.state)}
          </span>
        </div>
      </header>

      <p className="max-w-prose leading-relaxed">{restaurant.description}</p>

      <div className="grid gap-8 md:grid-cols-[1fr_280px]">
        <section>
          <h2 className="mb-2 text-lg font-semibold">Reviews</h2>
          <Suspense fallback={<ReviewFormSkeleton />}>
            <ReviewFormSection restaurantId={restaurant.id} />
          </Suspense>

          <ReviewList reviews={restaurant.reviews} />
        </section>
        <aside>
          <h2 className="mb-2 text-lg font-semibold">Opening hours</h2>
          <OpeningHours hours={restaurant.openingHours} />
        </aside>
      </div>
    </article>
  );
}
