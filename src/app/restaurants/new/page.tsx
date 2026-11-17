import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SubmitRestaurantForm } from "@/components/restaurants/submit-restaurant-form";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Submit a restaurant",
  robots: { index: false },
};

export default function NewRestaurantPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Submit a restaurant</h1>
      <p className="mt-2 mb-6 max-w-xl text-muted-foreground">
        Know a great spot that&apos;s missing? Tell us about it. An admin will
        review it before it goes live.
      </p>

      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <NewRestaurantForm />
      </Suspense>
    </div>
  );
}

async function NewRestaurantForm() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in?callbackUrl=/restaurants/new");
  }

  return <SubmitRestaurantForm />;
}
