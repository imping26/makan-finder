import { Skeleton } from "@/components/ui/skeleton";

export function RestaurantDetailsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading restaurant"
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-2/3 max-w-md" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>

      <div className="flex max-w-prose flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-24" />
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-32" />
          {Array.from({ length: 7 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
