import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <Suspense
        fallback={<p className="mt-4 text-muted-foreground">Loading…</p>}
      >
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in?callbackUrl=/dashboard");
  }

  return (
    <p className="mt-4 text-muted-foreground">
      Welcome back{user ? `, ${user.name}` : ""}. Favourites and reviews coming
      soon.
    </p>
  );
}
