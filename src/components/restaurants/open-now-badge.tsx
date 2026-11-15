import { connection } from "next/server";
import { Skeleton } from "@/components/ui/skeleton";
import type { OpeningHours } from "@/lib/db/schema";
import { isOpenAt } from "@/lib/opening-hours";

export async function OpenNowBadge({ hours }: { hours: OpeningHours | null }) {
  await connection();

  if (!hours) {
    return null;
  }
  const open = isOpenAt(hours, new Date());

  return open ? (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
      Open now
    </span>
  ) : (
    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
      Closed
    </span>
  );
}

export function OpenNowBadgeSkeleton() {
  return <Skeleton className="h-5 w-16 rounded-full" />;
}
