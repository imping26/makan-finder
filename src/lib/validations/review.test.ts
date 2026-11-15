import { z } from "zod";
import { describe, expect, it } from "vitest";
import { reviewSchema } from "./review";

const valid = {
  restaurantId: "0b6f1c2e-8d4a-4f7e-9c3b-2a1d5e6f7a8b",
  rating: "4",
  content: "Sambal was spicy and the rice was fragrant.",
};

function fieldErrors(input: Record<string, unknown>) {
  const result = reviewSchema.safeParse(input);
  return result.success ? {} : z.flattenError(result.error).fieldErrors;
}

describe("reviewSchema", () => {
  it("accepts a valid review and coerces the rating to a number", () => {
    expect(reviewSchema.parse(valid)).toEqual({ ...valid, rating: 4 });
  });

  it("trims the content", () => {
    expect(
      reviewSchema.parse({ ...valid, content: "   Really good roti.   " })
        .content,
    ).toBe("Really good roti.");
  });

  it("rejects a missing rating (no star picked)", () => {
    expect(fieldErrors({ ...valid, rating: null }).rating).toEqual([
      "Pick a rating from 1 to 5",
    ]);
  });

  it("rejects ratings outside 1 to 5 or with decimals", () => {
    for (const rating of ["0", "6", "4.5"]) {
      expect(fieldErrors({ ...valid, rating }).rating).toBeDefined();
    }
  });

  it("counts length after trimming", () => {
    expect(fieldErrors({ ...valid, content: "  short     " }).content).toEqual([
      "Write at least 10 characters",
    ]);
  });

  it("rejects content over 1000 characters", () => {
    expect(
      fieldErrors({ ...valid, content: "a".repeat(1001) }).content,
    ).toEqual(["Keep it under 1000 characters"]);
  });

  it("rejects a restaurant id that is not a UUID", () => {
    expect(
      fieldErrors({ ...valid, restaurantId: "1 OR 1=1" }).restaurantId,
    ).toBeDefined();
  });
});
