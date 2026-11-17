import { Button } from "@/components/ui/button";
import { reviewSubmission } from "@/lib/actions/admin";
import { formatPriceRange, formatSlugLabel } from "@/lib/format";
import type { PendingRestaurant } from "@/lib/queries/admin";

const dateFormatter = new Intl.DateTimeFormat("en-MY", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kuala_Lumpur",
});

export function PendingRestaurantList({
  restaurants,
}: {
  restaurants: PendingRestaurant[];
}) {
  if (restaurants.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nothing waiting for review. 🎉
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {restaurants.map((restaurant) => (
        <li
          key={restaurant.id}
          className="flex flex-col gap-3 rounded-xl border p-4"
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="font-semibold">{restaurant.name}</h2>
            <span className="text-sm text-muted-foreground">
              {formatSlugLabel(restaurant.cuisine)} ·{" "}
              {formatPriceRange(restaurant.priceRange)}
              {restaurant.isHalal && " · Halal"}
            </span>
          </div>

          <p className="text-sm leading-relaxed">{restaurant.description}</p>

          <p className="text-sm text-muted-foreground">
            {restaurant.address}, {restaurant.city},{" "}
            {formatSlugLabel(restaurant.state)}
          </p>

          <p className="text-xs text-muted-foreground">
            Submitted by {restaurant.creator?.name ?? "a deleted user"} on{" "}
            <time dateTime={restaurant.createdAt.toISOString()}>
              {dateFormatter.format(restaurant.createdAt)}
            </time>
          </p>

          <form action={reviewSubmission} className="flex gap-2">
            <input type="hidden" name="restaurantId" value={restaurant.id} />
            <Button type="submit" name="intent" value="approve" size="sm">
              Approve
            </Button>
            <Button
              type="submit"
              name="intent"
              value="reject"
              size="sm"
              variant="outline"
            >
              Reject
            </Button>
          </form>
        </li>
      ))}
    </ul>
  );
}
