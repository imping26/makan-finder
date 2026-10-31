import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RestaurantFilters } from "@/lib/queries/restaurants";

export function Pagination({
  page,
  pageCount,
  filters,
}: {
  page: number;
  pageCount: number;
  filters: RestaurantFilters;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-4"
    >
      {page > 1 ? (
        <Button asChild size="sm" variant="outline">
          <Link href={buildPageHref(filters, page - 1)}>
            <ChevronLeft /> Previous
          </Link>
        </Button>
      ) : (
        <Button size="sm" variant="outline" disabled>
          <ChevronLeft /> Previous
        </Button>
      )}

      <span className="text-sm text-muted-foreground">
        Page {page} of {pageCount}
      </span>

      {page < pageCount ? (
        <Button asChild size="sm" variant="outline">
          <Link href={buildPageHref(filters, page + 1)}>
            Next <ChevronRight />
          </Link>
        </Button>
      ) : (
        <Button size="sm" variant="outline" disabled>
          Next <ChevronRight />
        </Button>
      )}
    </nav>
  );
}

function buildPageHref(filters: RestaurantFilters, page: number): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries({ ...filters, page })) {
    if (value === undefined) continue;
    if (key === "page" && value === 1) continue;
    searchParams.set(key, String(value));
  }

  const query = searchParams.toString();
  return query ? `/restaurants?${query}` : "/restaurants";
}
