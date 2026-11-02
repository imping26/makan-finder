import { Skeleton } from "@/components/ui/skeleton";
import { RestaurantCardSkeleton } from "./restaurant-card";

export function RestaurantGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading restaurants">
      <Skeleton className="mb-4 h-5 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <RestaurantCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
