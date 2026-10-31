import Form from "next/form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { CUISINES, MALAYSIAN_STATES } from "@/lib/db/schema";
import { formatPriceRange, formatSlugLabel } from "@/lib/format";
import type { RestaurantFilters } from "@/lib/queries/restaurants";

export async function FilterBar({
  filtersPromise,
}: {
  filtersPromise: Promise<RestaurantFilters>;
}) {
  const filters = await filtersPromise;
  return (
    <Form
      key={JSON.stringify(filters)}
      action="/restaurants"
      className="mb-6 flex flex-wrap items-end gap-3"
    >
      <div className="grid gap-1.5">
        <Label htmlFor="q">Search</Label>
        <Input
          id="q"
          type="search"
          name="q"
          defaultValue={filters.q ?? ""}
          placeholder="Nasi lemak…"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="state">State</Label>
        <NativeSelect
          id="state"
          name="state"
          defaultValue={filters.state ?? ""}
        >
          <NativeSelectOption value="">All states</NativeSelectOption>
          {MALAYSIAN_STATES.map((state) => (
            <NativeSelectOption key={state} value={state}>
              {formatSlugLabel(state)}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="cuisine">Cuisine</Label>
        <NativeSelect
          id="cuisine"
          name="cuisine"
          defaultValue={filters.cuisine ?? ""}
        >
          <NativeSelectOption value="">All cuisines</NativeSelectOption>
          {CUISINES.map((cuisine) => (
            <NativeSelectOption key={cuisine} value={cuisine}>
              {formatSlugLabel(cuisine)}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="priceRange">Price</Label>
        <NativeSelect
          id="priceRange"
          name="priceRange"
          defaultValue={filters.priceRange?.toString() ?? ""}
        >
          <NativeSelectOption value="">Any price</NativeSelectOption>
          {[1, 2, 3].map((price) => (
            <NativeSelectOption key={price} value={price}>
              {formatPriceRange(price)}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <div className="flex h-8 items-center gap-2">
        <Checkbox
          id="halal"
          name="halal"
          defaultChecked={filters.halal === true}
        />
        <Label htmlFor="halal">Halal only</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm">
          Apply
        </Button>
        <Button asChild size="sm" variant="ghost">
          <Link href="/restaurants">Clear</Link>
        </Button>
      </div>
    </Form>
  );
}

export function FilterBarSkeleton() {
  return <div className="mb-6 h-14 animate-pulse rounded-lg bg-muted" />;
}
