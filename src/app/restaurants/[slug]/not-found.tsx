import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RestaurantNotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-16">
      <h1 className="text-2xl font-bold">Restaurant not found</h1>
      <p className="text-muted-foreground">
        This restaurant doesn&apos;t exist or is no longer listed.
      </p>
      <Button asChild variant="outline">
        <Link href="/restaurants">Browse all restaurants</Link>
      </Button>
    </div>
  );
}
