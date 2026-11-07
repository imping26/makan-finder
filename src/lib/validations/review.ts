import { z } from "zod";

export const REVIEW_CONTENT_MIN = 10;
export const REVIEW_CONTENT_MAX = 1000;

export const reviewSchema = z.object({
  restaurantId: z.uuid(),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Pick a rating from 1 to 5")
    .max(5, "Pick a rating from 1 to 5"),
  content: z
    .string()
    .trim()
    .min(REVIEW_CONTENT_MIN, `Write at least ${REVIEW_CONTENT_MIN} characters`)
    .max(REVIEW_CONTENT_MAX, `Keep it under ${REVIEW_CONTENT_MAX} characters`),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export type ReviewFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"rating" | "content", string[]>>;
  values?: { rating: number; content: string };
};
