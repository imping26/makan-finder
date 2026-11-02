/** "kuala-lumpur" → "Kuala Lumpur" */
export function formatSlugLabel(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}…`;
}

/** 1 → "RM", 3 → "RMRMRM" */
export function formatPriceRange(priceRange: number) {
  return "RM".repeat(priceRange);
}
