import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { MyReviewList } from "@/components/dashboard/my-review-list";
import { RestaurantCard } from "@/components/restaurants/restaurant-card";
import { getMyFavorites } from "@/lib/queries/favorites";
import { getMyReviews } from "@/lib/queries/reviews";
import { getCurrentUser } from "@/lib/session";
import { getMySubmissions } from "@/lib/queries/submissions";
import { MySubmissionList } from "@/components/dashboard/my-submission-list";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

async function SubmittedNotice({
  searchParams,
}: Pick<PageProps<"/dashboard">, "searchParams">) {
  const { submitted } = await searchParams;
  if (submitted !== "1") {
    return null;
  }

  return (
    <p
      role="status"
      className="mt-4 rounded-lg border bg-muted/50 px-4 py-3 text-sm"
    >
      Thanks! Your restaurant is waiting for review.
    </p>
  );
}

export default function DashboardPage({
  searchParams,
}: PageProps<"/dashboard">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <Suspense fallback={null}>
        <SubmittedNotice searchParams={searchParams} />
      </Suspense>

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

  const [favourites, reviews, submissions] = await Promise.all([
    getMyFavorites(),
    getMyReviews(),
    getMySubmissions(),
  ]);

  return (
    <div className="mt-6 flex flex-col gap-10">
      <p className="text-muted-foreground">Welcome back, {user.name}.</p>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">
          My favourites{" "}
          <span className="text-muted-foreground">({favourites.length})</span>
        </h2>
        {favourites.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No favourites yet. Tap <span aria-hidden>♡</span> Save on a
            restaurant to keep it here.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favourites.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">
          My reviews{" "}
          <span className="text-muted-foreground">({reviews.length})</span>
        </h2>
        <MyReviewList reviews={reviews} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            My submissions{" "}
            <span className="text-muted-foreground">
              ({submissions.length})
            </span>
          </h2>
          <Link
            href="/restaurants/new"
            className="text-sm underline underline-offset-4"
          >
            Submit a restaurant
          </Link>
        </div>
        <MySubmissionList submissions={submissions} />
      </section>
    </div>
  );
}
