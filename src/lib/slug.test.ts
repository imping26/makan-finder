import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and joins words with hyphens", () => {
    expect(slugify("Nasi Lemak Pak Mat")).toBe("nasi-lemak-pak-mat");
  });

  it("removes punctuation", () => {
    expect(slugify("Mamak & Co. (Penang)!")).toBe("mamak-co-penang");
  });

  it("strips accents instead of dropping the letter", () => {
    expect(slugify("Kopi Café")).toBe("kopi-cafe");
  });

  it("collapses repeated spaces, underscores and hyphens", () => {
    expect(slugify("Roti   Canai__Corner -- SS2")).toBe(
      "roti-canai-corner-ss2",
    );
  });

  it("does not start or end with a hyphen", () => {
    expect(slugify("- Kopitiam -")).toBe("kopitiam");
    expect(slugify("Satay!!! ")).toBe("satay");
  });
});
