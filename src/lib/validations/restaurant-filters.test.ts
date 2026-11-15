import { describe, expect, it } from "vitest";
import { parseRestaurantFilters } from "./restaurant-filters";

describe("parseRestaurantFilters", () => {
  it("returns no filters for an empty URL", () => {
    expect(parseRestaurantFilters({})).toEqual({});
  });

  it("parses valid params into typed values", () => {
    expect(
      parseRestaurantFilters({
        state: "selangor",
        cuisine: "malay",
        priceRange: "2",
        halal: "on",
        q: "  nasi lemak  ",
        page: "3",
      }),
    ).toEqual({
      state: "selangor",
      cuisine: "malay",
      priceRange: 2,
      halal: true,
      q: "nasi lemak",
      page: 3,
    });
  });

  it("ignores values that are not allowed instead of throwing", () => {
    expect(
      parseRestaurantFilters({
        state: "mars",
        cuisine: "pizza-from-space",
        priceRange: "4",
        page: "abc",
      }),
    ).toEqual({});
  });

  it("ignores non-positive or fractional pages", () => {
    expect(parseRestaurantFilters({ page: "0" }).page).toBeUndefined();
    expect(parseRestaurantFilters({ page: "-2" }).page).toBeUndefined();
    expect(parseRestaurantFilters({ page: "1.5" }).page).toBeUndefined();
  });

  it("treats an empty select option as not set", () => {
    expect(parseRestaurantFilters({ state: "", cuisine: "" })).toEqual({});
  });

  it("takes the first value when a param is repeated", () => {
    expect(parseRestaurantFilters({ state: ["penang", "johor"] }).state).toBe(
      "penang",
    );
  });

  it("ignores a search query longer than 100 characters", () => {
    expect(parseRestaurantFilters({ q: "a".repeat(101) }).q).toBeUndefined();
  });
});
