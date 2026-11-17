import { z } from "zod";
import { describe, expect, it } from "vitest";
import {
  restaurantSubmissionSchema,
  reviewSubmissionSchema,
} from "./restaurant";

const valid = {
  name: "Kopitiam Ah Seng",
  description: "Old-school kopitiam with charcoal toast and soft-boiled eggs.",
  state: "penang",
  city: "George Town",
  address: "12 Lebuh Chulia",
  cuisine: "chinese",
  priceRange: "1",
  isHalal: false,
};

function fieldErrors(input: Record<string, unknown>) {
  const result = restaurantSubmissionSchema.safeParse(input);
  return result.success ? {} : z.flattenError(result.error).fieldErrors;
}

describe("restaurantSubmissionSchema", () => {
  it("accepts a valid submission and coerces the price to a number", () => {
    expect(restaurantSubmissionSchema.parse(valid)).toEqual({
      ...valid,
      priceRange: 1,
    });
  });

  it("trims text fields", () => {
    const parsed = restaurantSubmissionSchema.parse({
      ...valid,
      name: "   Kopitiam Ah Seng   ",
      city: "  George Town ",
    });
    expect(parsed.name).toBe("Kopitiam Ah Seng");
    expect(parsed.city).toBe("George Town");
  });

  it("counts length after trimming", () => {
    expect(fieldErrors({ ...valid, name: "  ab  " }).name).toEqual([
      "Name needs at least 3 characters",
    ]);
  });

  it("asks for a longer description", () => {
    expect(
      fieldErrors({ ...valid, description: "Nice food." }).description,
    ).toEqual(["Tell people a bit more (at least 20 characters)"]);
  });

  it("rejects the empty placeholder option for state and cuisine", () => {
    const errors = fieldErrors({ ...valid, state: "", cuisine: "" });
    expect(errors.state).toEqual(["Pick a state"]);
    expect(errors.cuisine).toEqual(["Pick a cuisine"]);
  });

  it("rejects values that are not in the lists", () => {
    const errors = fieldErrors({ ...valid, state: "bali", cuisine: "pizza" });
    expect(errors.state).toBeDefined();
    expect(errors.cuisine).toBeDefined();
  });

  it("rejects a missing or out-of-range price", () => {
    for (const priceRange of ["", "0", "4", "1.5"]) {
      expect(fieldErrors({ ...valid, priceRange }).priceRange).toEqual([
        "Pick a price range",
      ]);
    }
  });

  it("needs isHalal as a boolean, not the raw checkbox value", () => {
    expect(fieldErrors({ ...valid, isHalal: "on" }).isHalal).toBeDefined();
    expect(
      restaurantSubmissionSchema.parse({ ...valid, isHalal: true }),
    ).toMatchObject({ isHalal: true });
  });
});

describe("reviewSubmissionSchema", () => {
  const restaurantId = "0b6f1c2e-8d4a-4f7e-9c3b-2a1d5e6f7a8b";

  it("accepts approve and reject", () => {
    for (const intent of ["approve", "reject"]) {
      expect(
        reviewSubmissionSchema.safeParse({ restaurantId, intent }).success,
      ).toBe(true);
    }
  });

  it("rejects any other intent", () => {
    for (const intent of ["delete", "", null]) {
      expect(
        reviewSubmissionSchema.safeParse({ restaurantId, intent }).success,
      ).toBe(false);
    }
  });

  it("rejects an id that is not a uuid", () => {
    expect(
      reviewSubmissionSchema.safeParse({
        restaurantId: "seed-user-aiman",
        intent: "approve",
      }).success,
    ).toBe(false);
  });
});
