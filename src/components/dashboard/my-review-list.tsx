import { Star } from "lucide-react";
import Link from "next/link";
import type { MyReview } from "@/lib/queries/reviews";

const dateFormatter = new Intl.DateTimeFormat("en-MY", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kuala_Lumpur",
});

export function MyReviewList({ reviews }: { reviews: MyReview[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        You haven&apos;t reviewed anywhere yet.{" "}
        <Link href="/restaurants" className="underline underline-offset-4">
          Find a place to try
        </Link>
        .
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y rounded-xl border">
      {reviews.map((review) => (
        <li key={review.id} className="flex flex-col gap-1 p-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href={`/restaurants/${review.restaurant.slug}`}
              className="font-medium hover:underline"
            >
              {review.restaurant.name}
            </Link>
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
              dateTime={review.updatedAt.toISOString()}
              className="ml-auto text-muted-foreground"
            >
              {dateFormatter.format(review.updatedAt)}
            </time>
          </div>
          <p className="text-sm leading-relaxed">{review.content}</p>
        </li>
      ))}
    </ul>
  );
}
