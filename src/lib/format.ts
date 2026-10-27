/** "kuala-lumpur" → "Kuala Lumpur" */
export function formatSlugLabel(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** 1 → "RM", 3 → "RMRMRM" */
export function formatPriceRange(priceRange: number) {
  return "RM".repeat(priceRange);
}
