import { randomUUID } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";
import { slugify } from "../src/lib/slug";
import {
  ADMIN_STORAGE_STATE,
  E2E_RESTAURANT_PREFIX,
  STORAGE_STATE,
} from "./env";

test.use({ storageState: STORAGE_STATE });

function newRestaurant() {
  const name = `${E2E_RESTAURANT_PREFIX} Kopitiam ${randomUUID().slice(0, 8)}`;
  return { name, slug: slugify(name) };
}

async function submit(page: Page, name: string) {
  await page.goto("/restaurants/new");
  await page.getByLabel("Restaurant name").fill(name);
  await page
    .getByLabel("What makes it worth a visit?")
    .fill("Charcoal toast, soft-boiled eggs and very strong kopi-o.");
  await page.getByLabel("State", { exact: true }).selectOption("penang");
  await page.getByLabel("City or area").fill("George Town");
  await page.getByLabel("Address").fill("12 Lebuh Chulia");
  await page.getByLabel("Cuisine").selectOption("chinese");
  await page.getByLabel("Price", { exact: true }).selectOption("1");
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page).toHaveURL(/\/dashboard\?submitted=1/);
}

const mySubmission = (page: Page, name: string) =>
  page
    .locator("section", {
      has: page.getByRole("heading", { name: /My submissions/ }),
    })
    .getByRole("listitem")
    .filter({ hasText: name });

const notFound = (page: Page) =>
  page.getByRole("heading", { level: 1, name: /not found/ });

test("a new submission is pending and hidden", async ({ page }) => {
  const restaurant = newRestaurant();
  await submit(page, restaurant.name);

  await expect(page.getByRole("status")).toHaveText(
    "Thanks! Your restaurant is waiting for review.",
  );
  await expect(mySubmission(page, restaurant.name)).toContainText(
    "Pending review",
  );

  await page.goto(`/restaurants/${restaurant.slug}`);
  await expect(notFound(page)).toBeVisible();

  await page.goto("/admin");
  await expect(notFound(page)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Review submissions" }),
  ).toHaveCount(0);
});

test("an admin approves a submission and it goes live", async ({
  page,
  browser,
}) => {
  const restaurant = newRestaurant();
  await submit(page, restaurant.name);

  await page.goto(`/restaurants/${restaurant.slug}`);
  await expect(notFound(page)).toBeVisible();

  const admin = await browser.newContext({ storageState: ADMIN_STORAGE_STATE });
  try {
    const adminPage = await admin.newPage();
    await adminPage.goto("/admin");
    const card = adminPage.getByRole("listitem").filter({
      has: adminPage.getByRole("heading", { name: restaurant.name }),
    });
    await expect(card).toContainText("Submitted by E2E Tester");
    await card.getByRole("button", { name: "Approve" }).click();
    await expect(card).toHaveCount(0);
  } finally {
    await admin.close();
  }

  await expect(async () => {
    await page.goto(`/restaurants/${restaurant.slug}`);
    await expect(
      page.getByRole("heading", { level: 1, name: restaurant.name }),
    ).toBeVisible({ timeout: 1_000 });
  }).toPass();

  await page.goto(`/restaurants?q=${encodeURIComponent(restaurant.name)}`);
  await expect(
    page.getByRole("link", { name: new RegExp(restaurant.name) }),
  ).toBeVisible();

  await page.goto("/dashboard");
  await expect(mySubmission(page, restaurant.name)).toContainText("Live");
});

test("an admin rejects a submission and it stays hidden", async ({
  page,
  browser,
}) => {
  const restaurant = newRestaurant();
  await submit(page, restaurant.name);

  const admin = await browser.newContext({ storageState: ADMIN_STORAGE_STATE });
  try {
    const adminPage = await admin.newPage();
    await adminPage.goto("/admin");
    const card = adminPage.getByRole("listitem").filter({
      has: adminPage.getByRole("heading", { name: restaurant.name }),
    });
    await card.getByRole("button", { name: "Reject" }).click();
    await expect(card).toHaveCount(0);
  } finally {
    await admin.close();
  }

  await page.goto("/dashboard");
  await expect(mySubmission(page, restaurant.name)).toContainText(
    "Not approved",
  );
  await page.goto(`/restaurants/${restaurant.slug}`);
  await expect(notFound(page)).toBeVisible();
});
