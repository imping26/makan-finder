import { test as setup, type BrowserContext } from "@playwright/test";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { testUtils } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/lib/db/schema";
import {
  ADMIN_STORAGE_STATE,
  E2E_ADMIN,
  E2E_AUTH_SECRET,
  E2E_BASE_URL,
  E2E_USER,
  getE2EDatabaseUrl,
  STORAGE_STATE,
} from "./env";

async function signIn(
  context: BrowserContext,
  user: { id: string; name: string; email: string },
  role: "user" | "admin",
  path: string,
) {
  const client = postgres(getE2EDatabaseUrl(), { max: 1 });
  const testAuth = betterAuth({
    baseURL: E2E_BASE_URL,
    secret: E2E_AUTH_SECRET,
    database: drizzleAdapter(drizzle(client, { schema }), {
      provider: "pg",
      schema,
    }),
    plugins: [testUtils()],
  });

  try {
    const { test } = await testAuth.$context;

    await test.deleteUser(user.id).catch(() => {});
    await test.saveUser(test.createUser(user));
    await client`update "user" set role = ${role} where id = ${user.id}`;

    const cookies = await test.getCookies({
      userId: user.id,
      domain: "localhost",
    });
    await context.addCookies(cookies);
    await context.storageState({ path });
  } finally {
    await client.end();
  }
}

setup("sign in the E2E user", async ({ context }) => {
  await signIn(context, E2E_USER, "user", STORAGE_STATE);
});

setup("sign in the E2E admin", async ({ context }) => {
  await signIn(context, E2E_ADMIN, "admin", ADMIN_STORAGE_STATE);
});
