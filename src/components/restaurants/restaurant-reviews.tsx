import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getRestaurantReviews } from "@/lib/queries/reviews";
import { ReviewList } from "./review-list";

export async function RatingSummary({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const { avgRating, reviewCount } = await getRestaurantReviews(restaurantId);

  return (
    <span className="flex items-center gap-1">
      <Star className="size-4 fill-amber-400 text-amber-400" />
      <span className="text-foreground">{avgRating.toFixed(1)}</span>(
      {reviewCount} {reviewCount === 1 ? "review" : "reviews"})
    </span>
  );
}

export function RatingSummarySkeleton() {
  return <Skeleton className="h-4 w-24" />;
}

export async function RestaurantReviews({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const { reviews } = await getRestaurantReviews(restaurantId);
  return <ReviewList reviews={reviews} />;
}

export function RestaurantReviewsSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-4">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}
