import type { Metadata } from "next";
import { PendingRestaurantList } from "@/components/admin/pending-restaurant-list";
import { getPendingRestaurants } from "@/lib/queries/admin";
import { getCurrentUser } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Review submissions",
  robots: { index: false },
};

async function PendingSubmissions() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in?callbackUrl=/admin");
  }

  if (user.role !== "admin") {
    notFound();
  }
  const pending = await getPendingRestaurants();

  return (
    <>
      <h1 className="text-2xl font-semibold">Review submissions</h1>
      <p className="mt-2 mb-6 text-muted-foreground">
        Approve a restaurant to publish it, or reject it to keep it hidden.
      </p>
      <PendingRestaurantList restaurants={pending} />
    </>
  );
}

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <PendingSubmissions />
      </Suspense>
    </div>
  );
}
