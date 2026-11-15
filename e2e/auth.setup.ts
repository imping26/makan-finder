import { test as setup } from "@playwright/test";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { testUtils } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/lib/db/schema";
import {
  E2E_AUTH_SECRET,
  E2E_BASE_URL,
  E2E_USER,
  getE2EDatabaseUrl,
  STORAGE_STATE,
} from "./env";

setup("sign in the E2E user", async ({ context }) => {
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

    await test.deleteUser(E2E_USER.id).catch(() => {});
    await test.saveUser(test.createUser(E2E_USER));

    const cookies = await test.getCookies({
      userId: E2E_USER.id,
      domain: "localhost",
    });
    await context.addCookies(cookies);
    await context.storageState({ path: STORAGE_STATE });
  } finally {
    await client.end();
  }
});
