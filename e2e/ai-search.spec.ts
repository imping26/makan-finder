import { expect, test } from "@playwright/test";
import { STORAGE_STATE } from "./env";

test("signed-out visitors don't see AI search", async ({ page }) => {
  await page.goto("/restaurants");
  await expect(page.getByRole("button", { name: "Apply" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ask AI" })).toHaveCount(0);
});

test.describe("signed in", () => {
  test.use({ storageState: STORAGE_STATE });

  test("turns a sentence into filters in the URL", async ({ page }) => {
    await page.goto("/restaurants");
    await page
      .getByLabel("Describe what you feel like eating")
      .fill("cheap halal malay food in Kuala Lumpur");
    await page.getByRole("button", { name: "Ask AI" }).click();

    await expect(page).toHaveURL(
      /\/restaurants\?state=kuala-lumpur&cuisine=malay&priceRange=1&halal=on$/,
    );
    await expect(page.getByLabel("Cuisine")).toHaveValue("malay");
    await expect(page.getByLabel("Halal only")).toBeChecked();
    await expect(
      page.getByRole("link", { name: /Nasi Lemak Pak Mat Kampung Baru/ }),
    ).toBeVisible();
  });
});
