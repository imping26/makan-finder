"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import "./globals.css";

export default function GlobalError({
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
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <title>Something went wrong | Makan Finder</title>
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center gap-4 px-4 py-16">
          <p className="text-sm font-medium text-muted-foreground">
            Makan Finder
          </p>
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground">
            The site hit an unexpected error. Please try again in a moment.
          </p>
          {digest && (
            <p className="font-mono text-xs text-muted-foreground">
              Error ID: {digest}
            </p>
          )}
          <Button onClick={() => retry()}>Try again</Button>
        </main>
      </body>
    </html>
  );
}
