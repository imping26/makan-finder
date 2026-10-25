import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.",
  );
}

// dev 模式下 hot reload 会重复建连接，挂在 globalThis 上复用
const globalForDb = globalThis as unknown as {
  pgClient?: ReturnType<typeof postgres>;
};

// prepare: false → 兼容 Supabase / Neon 的 pooled (transaction mode) 连接
const client =
  globalForDb.pgClient ??
  postgres(connectionString, { prepare: false, max: 10 });
if (process.env.NODE_ENV !== "production") globalForDb.pgClient = client;

export const db = drizzle(client, { schema });
export { schema };
