import { expect, test } from "@playwright/test";

test("browse from the home page into a filtered list and a restaurant", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Find your next makan spot" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Top rated" })).toBeVisible();

  await page.getByRole("link", { name: "Kuala Lumpur", exact: true }).click();
  await expect(page).toHaveURL(/\/restaurants\?state=kuala-lumpur/);

  await page.getByLabel("Cuisine").selectOption("malay");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page).toHaveURL(/state=kuala-lumpur/);
  await expect(page).toHaveURL(/cuisine=malay/);

  await page
    .getByRole("link", { name: /Nasi Lemak Pak Mat Kampung Baru/ })
    .click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Nasi Lemak Pak Mat Kampung Baru",
    }),
  ).toBeVisible();
  await expect(
    page.locator("article header").getByText(/^(Open now|Closed)$/),
  ).toBeVisible();
  await expect(
    page.getByText("Sign in to rate and review this place."),
  ).toBeVisible();
});

test("dashboard redirects signed-out visitors to sign in", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in\?callbackUrl=%2Fdashboard/);
});

test("unknown pages return a 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
});
