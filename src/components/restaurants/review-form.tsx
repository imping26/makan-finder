"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  REVIEW_CONTENT_MAX,
  REVIEW_CONTENT_MIN,
  type ReviewFormState,
} from "@/lib/validations/review";
import { useActionState } from "react";
import { deleteReview, saveReview } from "@/lib/actions/reviews";

type ReviewFormProps = {
  restaurantId: string;
  defaultValues: { rating: number; content: string } | null;
};

const initialState: ReviewFormState = { status: "idle" };

export function ReviewForm({ restaurantId, defaultValues }: ReviewFormProps) {
  const [state, formAction, pending] = useActionState(saveReview, initialState);

  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteReview,
    initialState,
  );

  const values = state.values ?? defaultValues;

  const isEdit = defaultValues !== null;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-xl border p-4"
    >
      <h3 className="font-medium">
        {isEdit ? "Update your review" : "Write a review"}
      </h3>

      <input type="hidden" name="restaurantId" value={restaurantId} />

      <fieldset className="flex flex-col gap-1">
        <legend className="mb-1 text-sm text-muted-foreground">Rating</legend>
        <div className="flex flex-row-reverse justify-end gap-1 [&_label:has(:checked)_svg]:fill-amber-400 [&_label:has(:checked)_svg]:text-amber-400 [&_label:has(:checked)~label_svg]:fill-amber-400 [&_label:has(:checked)~label_svg]:text-amber-400">
          {[5, 4, 3, 2, 1].map((n) => (
            <label key={n} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={n}
                defaultChecked={values?.rating === n}
                className="peer sr-only"
              />
              <Star className="size-6 rounded-sm text-muted-foreground/40 peer-focus-visible:ring-2 peer-focus-visible:ring-ring" />
              <span className="sr-only">{n} stars</span>
            </label>
          ))}
        </div>
        {state.fieldErrors?.rating?.[0] && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.rating[0]}
          </p>
        )}
      </fieldset>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="review-content"
          className="text-sm text-muted-foreground"
        >
          Your review
        </label>
        <textarea
          id="review-content"
          name="content"
          rows={4}
          required
          minLength={REVIEW_CONTENT_MIN}
          maxLength={REVIEW_CONTENT_MAX}
          defaultValue={values?.content ?? ""}
          className="rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        {state.fieldErrors?.content?.[0] && (
          <p className="text-sm text-destructive">
            {state.fieldErrors?.content?.[0]}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Update review" : "Post review"}
        </Button>

        {isEdit && (
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            formAction={deleteAction}
            formNoValidate
            disabled={pending || deletePending}
            onClick={(e) => {
              if (!confirm("Delete your review?")) e.preventDefault();
            }}
          >
            {deletePending ? "Deleting…" : "Delete"}
          </Button>
        )}

        <p
          aria-live="polite"
          className={
            state.status === "success"
              ? "text-sm text-emerald-600"
              : "text-sm text-destructive"
          }
        >
          {state.message}
        </p>
        {deleteState.status === "error" && (
          <p aria-live="polite" className="text-sm text-destructive">
            {deleteState.message}
          </p>
        )}
      </div>
    </form>
  );
}
