import { z } from "zod";
import { CUISINES, MALAYSIAN_STATES } from "@/lib/db/schema";

export const restaurantSubmissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name needs at least 3 characters")
    .max(80, "Keep the name under 80 characters"),
  description: z
    .string()
    .trim()
    .min(20, "Tell people a bit more (at least 20 characters)")
    .max(500, "Keep it under 500 characters"),
  state: z.enum(MALAYSIAN_STATES, { error: "Pick a state" }),
  city: z.string().trim().min(2, "Enter the city or area").max(60),
  address: z.string().trim().min(5, "Enter the street address").max(200),
  cuisine: z.enum(CUISINES, { error: "Pick a cuisine" }),
  priceRange: z.coerce
    .number({ error: "Pick a price range" })
    .int()
    .min(1, "Pick a price range")
    .max(3, "Pick a price range"),
  isHalal: z.boolean(),
});

export type RestaurantSubmission = z.infer<typeof restaurantSubmissionSchema>;

export const reviewSubmissionSchema = z.object({
  restaurantId: z.uuid(),
  intent: z.enum(["approve", "reject"]),
});

type SubmissionField = keyof RestaurantSubmission;

export type SubmitRestaurantState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<SubmissionField, string[]>>;
  values?: Partial<Record<SubmissionField, string>>;
};
