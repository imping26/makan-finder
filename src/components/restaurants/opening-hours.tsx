import type { OpeningHours as OpeningHoursData } from "@/lib/db/schema";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function OpeningHours({ hours }: { hours: OpeningHoursData | null }) {
  if (!hours) {
    return <p className="text-sm text-muted-foreground">Hours not listed.</p>;
  }

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
      {DAYS.map((day, i) => {
        const slot = hours[String(i) as keyof OpeningHoursData];
        return (
          <div key={day} className="contents">
            <dt className="text-muted-foreground">{day}</dt>
            <dd>
              {!slot || "closed" in slot
                ? "Closed"
                : `${slot.open} – ${slot.close}`}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
