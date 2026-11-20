import { describe, expect, it } from "vitest";
import {
  filtersToSearchParams,
  parseRestaurantFilters,
} from "./restaurant-filters";

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

describe("filtersToSearchParams", () => {
  it("returns an empty string when there are no filters", () => {
    expect(filtersToSearchParams({})).toBe("");
  });

  it("uses the same format as the filter form", () => {
    expect(
      filtersToSearchParams({ state: "penang", priceRange: 1, halal: true }),
    ).toBe("state=penang&priceRange=1&halal=on");
  });

  it("round-trips through parseRestaurantFilters", () => {
    const filters = {
      state: "kuala-lumpur",
      cuisine: "mamak",
      priceRange: 2,
      halal: true,
      q: "Nasi Kandar & Co",
    } as const;
    const params = new URLSearchParams(filtersToSearchParams(filters));
    expect(parseRestaurantFilters(Object.fromEntries(params))).toEqual(filters);
  });
});
