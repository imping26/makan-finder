"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest =
    error instanceof Error &&
    "digest" in error &&
    typeof error.digest === "string"
      ? error.digest
      : undefined;

  return (
    <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-16">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground">
        We couldn&apos;t load this page. Please try again in a moment.
      </p>
      {digest && (
        <p className="font-mono text-xs text-muted-foreground">
          Error ID: {digest}
        </p>
      )}
      <Button onClick={() => retry()}>Try again</Button>
    </div>
  );
}
