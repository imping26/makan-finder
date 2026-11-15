import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/lib/db/schema";
import { slugify } from "../src/lib/slug";
import {
  HOURS,
  REVIEW_TEMPLATES,
  SEED_RESTAURANTS,
  SEED_USERS,
} from "./seed-data";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set in .env.local");

const client = postgres(url, { prepare: false, max: 1 });
const db = drizzle(client, { schema });

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(2026);
const pick = <T>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];

function randomRating(): 1 | 2 | 3 | 4 | 5 {
  const r = rand();
  if (r < 0.45) return 5;
  if (r < 0.8) return 4;
  if (r < 0.92) return 3;
  if (r < 0.98) return 2;
  return 1;
}

async function main() {
  console.log("🧹 Clearing existing data…");
  await db.delete(schema.favorites);
  await db.delete(schema.photos);
  await db.delete(schema.reviews);
  await db.delete(schema.restaurants);
  await db.delete(schema.session);
  await db.delete(schema.account);
  await db.delete(schema.user);

  console.log("👤 Inserting users…");
  await db.insert(schema.user).values(
    SEED_USERS.map((u, i) => ({
      ...u,
      emailVerified: true,
      role: i === 0 ? ("admin" as const) : ("user" as const),
    })),
  );

  console.log(`🍜 Inserting ${SEED_RESTAURANTS.length} restaurants…`);
  const inserted = await db
    .insert(schema.restaurants)
    .values(
      SEED_RESTAURANTS.map(({ hours, ...r }) => ({
        ...r,
        slug: slugify(r.name),
        openingHours: HOURS[hours],
        status: "approved" as const,
        createdBy: SEED_USERS[0].id,
      })),
    )
    .returning({ id: schema.restaurants.id });

  console.log("⭐ Inserting reviews…");
  const reviewRows: (typeof schema.reviews.$inferInsert)[] = [];
  const now = Date.now();
  for (const { id: restaurantId } of inserted) {
    const reviewers = [...SEED_USERS]
      .sort(() => rand() - 0.5)
      .slice(0, Math.floor(rand() * 7));
    for (const u of reviewers) {
      const rating = randomRating();
      const createdAt = new Date(now - Math.floor(rand() * 180) * 86_400_000);
      reviewRows.push({
        restaurantId,
        userId: u.id,
        rating,
        content: pick(REVIEW_TEMPLATES[rating]),
        createdAt,
        updatedAt: createdAt,
      });
    }
  }
  if (reviewRows.length) await db.insert(schema.reviews).values(reviewRows);

  console.log("🧮 Recomputing avg_rating / review_count…");
  await client`
    UPDATE restaurants r SET
      avg_rating   = COALESCE(s.avg, 0),
      review_count = COALESCE(s.cnt, 0)
    FROM (
      SELECT restaurant_id, ROUND(AVG(rating)::numeric, 1)::real AS avg, COUNT(*)::int AS cnt
      FROM reviews GROUP BY restaurant_id
    ) s
    WHERE r.id = s.restaurant_id
  `;

  console.log("❤️  Inserting favorites…");
  await db
    .insert(schema.favorites)
    .values(
      inserted
        .slice(0, 5)
        .map(({ id }) => ({ userId: SEED_USERS[1].id, restaurantId: id })),
    );

  console.log(
    `✅ Done: ${SEED_USERS.length} users, ${inserted.length} restaurants, ${reviewRows.length} reviews`,
  );
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(() => client.end());
