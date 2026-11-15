import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getIsFavorited } from "@/lib/queries/favorites";
import { getCurrentUser } from "@/lib/session";
import { FavoriteButton } from "./favorite-button";

export async function FavoriteSection({
  restaurantId,
  slug,
}: {
  restaurantId: string;
  slug: string;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link
          href={`/sign-in?callbackUrl=${encodeURIComponent(`/restaurants/${slug}`)}`}
        >
          <Heart className="size-4" />
          Save
        </Link>
      </Button>
    );
  }

  const isFavorited = await getIsFavorited(restaurantId);

  return (
    <FavoriteButton restaurantId={restaurantId} isFavorited={isFavorited} />
  );
}

export function FavoriteSkeleton() {
  return <div className="h-7 w-20 animate-pulse rounded-md bg-muted" />;
}
