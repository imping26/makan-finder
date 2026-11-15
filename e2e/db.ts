import postgres from "postgres";
import { E2E_USER, getE2EDatabaseUrl } from "./env";

export async function resetE2EUserData(restaurantSlug: string) {
  const sql = postgres(getE2EDatabaseUrl(), { max: 1 });
  try {
    await sql.begin(async (tx) => {
      const [restaurant] =
        await tx`select id from restaurants where slug = ${restaurantSlug}`;
      if (!restaurant) throw new Error(`Unknown restaurant ${restaurantSlug}`);

      await tx`delete from reviews where user_id = ${E2E_USER.id} and restaurant_id = ${restaurant.id}`;
      await tx`delete from favorites where user_id = ${E2E_USER.id} and restaurant_id = ${restaurant.id}`;
      await tx`
        update restaurants set
          avg_rating = coalesce((select avg(rating) from reviews where restaurant_id = ${restaurant.id}), 0),
          review_count = (select count(*) from reviews where restaurant_id = ${restaurant.id})
        where id = ${restaurant.id}
      `;
    });
  } finally {
    await sql.end();
  }
}
