import { describe, expect, it } from "vitest";
import { aiSearchSchema } from "./ai-search";

describe("aiSearchSchema", () => {
  it("trims the query", () => {
    expect(aiSearchSchema.parse({ query: "  cheap halal in KL  " })).toEqual({
      query: "cheap halal in KL",
    });
  });

  it("rejects a query that is too short", () => {
    expect(aiSearchSchema.safeParse({ query: " a " }).success).toBe(false);
  });

  it("rejects a query longer than 200 characters", () => {
    expect(aiSearchSchema.safeParse({ query: "a".repeat(201) }).success).toBe(
      false,
    );
  });

  it("rejects a missing query", () => {
    expect(aiSearchSchema.safeParse({}).success).toBe(false);
  });
});
