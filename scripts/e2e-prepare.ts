import { execSync } from "node:child_process";
import postgres from "postgres";
import { getE2EDatabaseUrl } from "../e2e/env";

async function main() {
  const url = getE2EDatabaseUrl();
  const { pathname } = new URL(url);
  const dbName = decodeURIComponent(pathname.slice(1));

  const admin = postgres({ ...parse(url), database: "postgres", max: 1 });
  const [exists] =
    await admin`select 1 from pg_database where datname = ${dbName}`;
  if (!exists) {
    console.log(`🆕 Creating database ${dbName}…`);
    await admin.unsafe(`create database "${dbName.replace(/"/g, '""')}"`);
  }
  await admin.end();

  const env = { ...process.env, DATABASE_URL: url, DATABASE_URL_UNPOOLED: url };
  execSync("npx drizzle-kit migrate", { stdio: "inherit", env });
  execSync("npx tsx scripts/seed.ts", { stdio: "inherit", env });
}

function parse(url: string) {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: Number(u.port || 5432),
    username: decodeURIComponent(u.username) || undefined,
    password: decodeURIComponent(u.password) || undefined,
  };
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
