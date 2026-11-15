import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-16">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-muted-foreground">
        We couldn&apos;t find what you were looking for. Maybe it&apos;s time to
        makan somewhere new.
      </p>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/restaurants">Browse restaurants</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
