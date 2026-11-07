"use client";

import { Heart } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { setFavorite } from "@/lib/actions/favorites";

type FavoriteButtonProps = {
  restaurantId: string;
  isFavorited: boolean;
};

export function FavoriteButton({
  restaurantId,
  isFavorited,
}: FavoriteButtonProps) {
  const [optimisticFavorited, setOptimisticFavorited] =
    useOptimistic(isFavorited);

  const [, startTransition] = useTransition();

  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    startTransition(async () => {
      const next = !optimisticFavorited;
      setOptimisticFavorited(next);
      const result = await setFavorite(restaurantId, next);
      setError(result.ok ? null : result.message);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        aria-pressed={optimisticFavorited}
        aria-label={
          optimisticFavorited ? "Remove from favourites" : "Add to favourites"
        }
      >
        <Heart
          className={
            optimisticFavorited
              ? "size-4 fill-rose-500 text-rose-500"
              : "size-4"
          }
        />
        {optimisticFavorited ? "Saved" : "Save"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
