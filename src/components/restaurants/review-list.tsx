import { Star } from "lucide-react";
import type { RestaurantDetail } from "@/lib/queries/restaurants";

// 固定 locale + timeZone：server 在哪个时区跑，显示的日期都一样
const dateFormatter = new Intl.DateTimeFormat("en-MY", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kuala_Lumpur",
});

export function ReviewList({
  reviews,
}: {
  reviews: RestaurantDetail["reviews"];
}) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No reviews yet. Be the first!
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y">
      {reviews.map((review) => (
        <li key={review.id} className="flex flex-col gap-1 py-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{review.user.name}</span>
            <span
              className="flex items-center gap-0.5"
              aria-label={`${review.rating} out of 5`}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={
                    i < review.rating
                      ? "size-3.5 fill-amber-400 text-amber-400"
                      : "size-3.5 text-muted-foreground/40"
                  }
                />
              ))}
            </span>
            <time
              dateTime={review.createdAt.toISOString()}
              className="ml-auto text-muted-foreground"
            >
              {dateFormatter.format(review.createdAt)}
            </time>
          </div>
          <p className="text-sm leading-relaxed">{review.content}</p>
        </li>
      ))}
    </ul>
  );
}
