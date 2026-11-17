"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { submitRestaurant } from "@/lib/actions/restaurants";
import { CUISINES, MALAYSIAN_STATES } from "@/lib/db/schema";
import { formatPriceRange, formatSlugLabel } from "@/lib/format";
import type { SubmitRestaurantState } from "@/lib/validations/restaurant";

const initialState: SubmitRestaurantState = { status: "idle" };

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.[0]) return null;
  return <p className="text-sm text-destructive">{messages[0]}</p>;
}

export function SubmitRestaurantForm() {
  const [state, formAction, pending] = useActionState(
    submitRestaurant,
    initialState,
  );
  const values = state.values;
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <div className="grid gap-1.5">
        <Label htmlFor="name">Restaurant name</Label>
        <Input
          id="name"
          name="name"
          required
          maxLength={80}
          defaultValue={values?.name}
          aria-invalid={!!errors?.name}
        />
        <FieldError messages={errors?.name} />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="description">What makes it worth a visit?</Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          minLength={20}
          maxLength={500}
          defaultValue={values?.description}
          aria-invalid={!!errors?.description}
          className="rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <FieldError messages={errors?.description} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="state">State</Label>
          <NativeSelect
            id="state"
            name="state"
            required
            defaultValue={values?.state ?? ""}
            aria-invalid={!!errors?.state}
          >
            <NativeSelectOption value="" disabled>
              Choose a state
            </NativeSelectOption>
            {MALAYSIAN_STATES.map((state) => (
              <NativeSelectOption key={state} value={state}>
                {formatSlugLabel(state)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldError messages={errors?.state} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="city">City or area</Label>
          <Input
            id="city"
            name="city"
            required
            maxLength={60}
            placeholder="Petaling Jaya"
            defaultValue={values?.city}
            aria-invalid={!!errors?.city}
          />
          <FieldError messages={errors?.city} />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          required
          maxLength={200}
          defaultValue={values?.address}
          aria-invalid={!!errors?.address}
        />
        <FieldError messages={errors?.address} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="cuisine">Cuisine</Label>
          <NativeSelect
            id="cuisine"
            name="cuisine"
            required
            defaultValue={values?.cuisine ?? ""}
            aria-invalid={!!errors?.cuisine}
          >
            <NativeSelectOption value="" disabled>
              Choose a cuisine
            </NativeSelectOption>
            {CUISINES.map((cuisine) => (
              <NativeSelectOption key={cuisine} value={cuisine}>
                {formatSlugLabel(cuisine)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldError messages={errors?.cuisine} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="priceRange">Price</Label>
          <NativeSelect
            id="priceRange"
            name="priceRange"
            required
            defaultValue={values?.priceRange ?? ""}
            aria-invalid={!!errors?.priceRange}
          >
            <NativeSelectOption value="" disabled>
              Choose a price range
            </NativeSelectOption>
            {[1, 2, 3].map((price) => (
              <NativeSelectOption key={price} value={price}>
                {formatPriceRange(price)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldError messages={errors?.priceRange} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="isHalal"
          name="isHalal"
          defaultChecked={values?.isHalal === "on"}
        />
        <Label htmlFor="isHalal">Halal</Label>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Submitting…" : "Submit for review"}
        </Button>
        {state.message && (
          <p aria-live="polite" className="text-sm text-destructive">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
