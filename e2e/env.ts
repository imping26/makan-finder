export const E2E_PORT = 3100;
export const E2E_BASE_URL = `http://localhost:${E2E_PORT}`;

export const E2E_AUTH_SECRET = "e2e-only-secret-never-used-in-production-0123";

export const STORAGE_STATE = "e2e/.auth/user.json";

export const E2E_USER = {
  id: "e2e-user",
  name: "E2E Tester",
  email: "e2e@example.com",
};

export function getE2EDatabaseUrl() {
  const url =
    process.env.E2E_DATABASE_URL ??
    "postgres://localhost:5432/makan_finder_e2e";
  const { hostname } = new URL(url);
  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    throw new Error(
      `E2E tests write data and must use a local database, got host "${hostname}".`,
    );
  }
  return url;
}
