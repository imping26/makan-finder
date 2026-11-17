import Link from "next/link";
import type { MySubmission } from "@/lib/queries/submissions";

const dateFormatter = new Intl.DateTimeFormat("en-MY", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kuala_Lumpur",
});

const STATUS_LABEL: Record<MySubmission["status"], string> = {
  pending: "Pending review",
  approved: "Live",
  rejected: "Not approved",
};

const STATUS_CLASS: Record<MySubmission["status"], string> = {
  pending: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  approved:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  rejected: "bg-muted text-foreground",
};

export function MySubmissionList({
  submissions,
}: {
  submissions: MySubmission[];
}) {
  if (submissions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Know a place we&apos;re missing?{" "}
        <Link href="/restaurants/new" className="underline underline-offset-4">
          Submit a restaurant
        </Link>
        .
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y rounded-xl border">
      {submissions.map((submission) => (
        <li key={submission.id} className="flex items-center gap-3 p-4 text-sm">
          {submission.status === "approved" ? (
            <Link
              href={`/restaurants/${submission.slug}`}
              className="font-medium hover:underline"
            >
              {submission.name}
            </Link>
          ) : (
            <span className="font-medium">{submission.name}</span>
          )}
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[submission.status]}`}
          >
            {STATUS_LABEL[submission.status]}
          </span>
          <time
            dateTime={submission.createdAt.toISOString()}
            className="ml-auto text-muted-foreground"
          >
            {dateFormatter.format(submission.createdAt)}
          </time>
        </li>
      ))}
    </ul>
  );
}
