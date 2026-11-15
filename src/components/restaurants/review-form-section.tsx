import { SignInButton } from "@/components/auth/sign-in-button";
import { getMyReview } from "@/lib/queries/reviews";
import { getCurrentUser } from "@/lib/session";
import { ReviewForm } from "./review-form";

export async function ReviewFormSection({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border p-4 text-sm">
        <span className="text-muted-foreground">
          Sign in to rate and review this place.
        </span>
        <SignInButton />
      </div>
    );
  }

  const myReview = await getMyReview(restaurantId);

  return <ReviewForm restaurantId={restaurantId} defaultValues={myReview} />;
}

export function ReviewFormSkeleton() {
  return <div className="h-48 animate-pulse rounded-xl bg-muted" />;
}
