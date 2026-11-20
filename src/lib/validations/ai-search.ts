import { z } from "zod";

export const aiSearchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(3, "Describe what you feel like eating")
    .max(200, "Keep it under 200 characters"),
});

export type AiSearchState = {
  error?: string;
  query?: string;
};
