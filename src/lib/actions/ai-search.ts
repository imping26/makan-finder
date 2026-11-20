"use server";

import { redirect } from "next/navigation";
import { searchTextToFilters } from "@/lib/ai/search-filters";
import type { RestaurantFilters } from "@/lib/queries/restaurants";
import { getCurrentUser } from "@/lib/session";
import {
  aiSearchSchema,
  type AiSearchState,
} from "@/lib/validations/ai-search";
import { filtersToSearchParams } from "@/lib/validations/restaurant-filters";

export async function aiSearch(
  _prev: AiSearchState,
  formData: FormData,
): Promise<AiSearchState> {
  const raw = formData.get("query");
  const query = typeof raw === "string" ? raw : "";

  const parsed = aiSearchSchema.safeParse({ query });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, query };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { error: "Please sign in to use AI search.", query };
  }

  let filters: RestaurantFilters;
  try {
    filters = await searchTextToFilters(parsed.data.query);
  } catch (e) {
    console.error(e);
    return {
      error: "AI search isn't available right now. Try the filters below.",
      query,
    };
  }

  redirect(`/restaurants?${filtersToSearchParams(filters)}`);
}
