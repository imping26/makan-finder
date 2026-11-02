import type { MetadataRoute } from "next";
import { getAllRestaurantSlugs } from "@/lib/queries/restaurants";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allSlug = await getAllRestaurantSlugs();

  const restaurantEntries: MetadataRoute.Sitemap = allSlug.map(({ slug }) => ({
    url: `${SITE_URL}/restaurants/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/restaurants`, changeFrequency: "daily", priority: 0.9 },
    ...restaurantEntries,
  ];
}
