import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* ──────────────────────────────────────────────────────────────
 * Enums
 * ────────────────────────────────────────────────────────────── */

export const MALAYSIAN_STATES = [
  "johor",
  "kedah",
  "kelantan",
  "melaka",
  "negeri-sembilan",
  "pahang",
  "penang",
  "perak",
  "perlis",
  "sabah",
  "sarawak",
  "selangor",
  "terengganu",
  "kuala-lumpur",
  "putrajaya",
  "labuan",
] as const;
export type MalaysianState = (typeof MALAYSIAN_STATES)[number];

export const CUISINES = [
  "malay",
  "chinese",
  "indian",
  "mamak",
  "nyonya",
  "western",
  "japanese",
  "korean",
  "thai",
  "cafe",
  "dessert",
  "fusion",
] as const;
export type Cuisine = (typeof CUISINES)[number];

export const stateEnum = pgEnum("malaysian_state", MALAYSIAN_STATES);
export const cuisineEnum = pgEnum("cuisine", CUISINES);
export const restaurantStatusEnum = pgEnum("restaurant_status", [
  "pending",
  "approved",
  "rejected",
]);
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

/* ──────────────────────────────────────────────────────────────
 * Auth tables (Better Auth core schema: user / session / account / verification)
 * 第 3 周装 Better Auth 时，跑 `npx @better-auth/cli generate` 对比一下，
 * 如果字段有出入，以 CLI 生成的为准。
 * ────────────────────────────────────────────────────────────── */

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: userRoleEnum("role").default("user").notNull(),
  ...timestamps,
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ...timestamps,
});

/* ──────────────────────────────────────────────────────────────
 * App tables
 * ────────────────────────────────────────────────────────────── */

/** 0 = Sunday … 6 = Saturday. 时间用 "HH:mm" 24 小时制。closed 表示当天休息。 */
export type OpeningHours = Partial<
  Record<"0" | "1" | "2" | "3" | "4" | "5" | "6", { open: string; close: string } | { closed: true }>
>;

export const restaurants = pgTable(
  "restaurants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    state: stateEnum("state").notNull(),
    city: text("city").notNull(),
    address: text("address").notNull(),
    cuisine: cuisineEnum("cuisine").notNull(),
    /** 1 = RM, 2 = RM RM, 3 = RM RM RM */
    priceRange: integer("price_range").notNull(),
    isHalal: boolean("is_halal").default(false).notNull(),
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),
    openingHours: jsonb("opening_hours").$type<OpeningHours>(),
    coverImage: text("cover_image"),
    /** 冗余字段：写评论时同步更新，列表页排序不用每次 AVG() */
    avgRating: real("avg_rating").default(0).notNull(),
    reviewCount: integer("review_count").default(0).notNull(),
    status: restaurantStatusEnum("status").default("approved").notNull(),
    createdBy: text("created_by").references(() => user.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("restaurants_slug_idx").on(t.slug),
    index("restaurants_state_cuisine_idx").on(t.state, t.cuisine),
    index("restaurants_rating_idx").on(t.avgRating),
    check("price_range_check", sql`${t.priceRange} between 1 and 3`),
  ],
);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    content: text("content").notNull(),
    ...timestamps,
  },
  (t) => [
    // 每人每家只能评一次
    uniqueIndex("reviews_restaurant_user_idx").on(t.restaurantId, t.userId),
    index("reviews_restaurant_created_idx").on(t.restaurantId, t.createdAt),
    check("rating_check", sql`${t.rating} between 1 and 5`),
  ],
);

export const favorites = pgTable(
  "favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.restaurantId] })],
);

export const photos = pgTable(
  "photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    uploadedBy: text("uploaded_by").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("photos_restaurant_idx").on(t.restaurantId)],
);

/* ──────────────────────────────────────────────────────────────
 * Relations（让 db.query.restaurants.findFirst({ with: { reviews: true } }) 可用）
 * ────────────────────────────────────────────────────────────── */

export const userRelations = relations(user, ({ many }) => ({
  reviews: many(reviews),
  favorites: many(favorites),
}));

export const restaurantRelations = relations(restaurants, ({ many, one }) => ({
  reviews: many(reviews),
  favorites: many(favorites),
  photos: many(photos),
  creator: one(user, { fields: [restaurants.createdBy], references: [user.id] }),
}));

export const reviewRelations = relations(reviews, ({ one }) => ({
  restaurant: one(restaurants, { fields: [reviews.restaurantId], references: [restaurants.id] }),
  user: one(user, { fields: [reviews.userId], references: [user.id] }),
}));

export const favoriteRelations = relations(favorites, ({ one }) => ({
  restaurant: one(restaurants, { fields: [favorites.restaurantId], references: [restaurants.id] }),
  user: one(user, { fields: [favorites.userId], references: [user.id] }),
}));

export const photoRelations = relations(photos, ({ one }) => ({
  restaurant: one(restaurants, { fields: [photos.restaurantId], references: [restaurants.id] }),
}));

/* Inferred types — 在组件和 queries 里直接用 */
export type Restaurant = typeof restaurants.$inferSelect;
export type NewRestaurant = typeof restaurants.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type User = typeof user.$inferSelect;
