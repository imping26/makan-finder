import { expect, test } from "@playwright/test";
import { STORAGE_STATE } from "./env";

test.use({ storageState: STORAGE_STATE });

const RESTAURANT = {
  name: "Nasi Lemak Pak Mat Kampung Baru",
  slug: "nasi-lemak-pak-mat-kampung-baru",
};

test("write, update and delete a review", async ({ page }) => {
  const reviewInList = (text: string) =>
    page.getByRole("listitem").getByText(text, { exact: true });
  const content = `E2E review ${Date.now()}: sambal was spicy, rice fragrant.`;
  const updated = `${content} Came back and it was even better.`;

  await page.goto(`/restaurants/${RESTAURANT.slug}`);

  await page.getByRole("radio", { name: "4 stars" }).check({ force: true });
  await page.getByLabel("Your review").fill(content);
  await page.getByRole("button", { name: "Post review" }).click();
  await expect(
    page.getByRole("button", { name: "Update review" }),
  ).toBeVisible();
  await expect(reviewInList(content)).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole("button", { name: "Update review" }),
  ).toBeVisible();
  await expect(reviewInList(content)).toBeVisible();

  await page.getByRole("radio", { name: "5 stars" }).check({ force: true });
  await page.getByLabel("Your review").fill(updated);
  await page.getByRole("button", { name: "Update review" }).click();
  await expect(page.getByText("Review saved")).toBeVisible();
  await expect(reviewInList(updated)).toBeVisible();

  await page.goto("/dashboard");
  const myReviews = page.locator("section", {
    has: page.getByRole("heading", { name: /My reviews/ }),
  });
  await expect(myReviews.getByText(updated, { exact: true })).toBeVisible();
  await expect(
    myReviews.getByRole("link", { name: RESTAURANT.name }),
  ).toBeVisible();

  await page.goto(`/restaurants/${RESTAURANT.slug}`);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByRole("button", { name: "Post review" })).toBeVisible();
  await expect(reviewInList(updated)).toHaveCount(0);
});

test("save and unsave a favourite", async ({ page }) => {
  await page.goto(`/restaurants/${RESTAURANT.slug}`);

  const save = page.getByRole("button", { name: /favourites/ });
  await expect(save).toHaveAttribute("aria-pressed", "false");
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", "true");

  await page.goto("/dashboard");
  const myFavourites = page.locator("section", {
    has: page.getByRole("heading", { name: /My favourites/ }),
  });
  await expect(
    myFavourites.getByRole("link", { name: new RegExp(RESTAURANT.name) }),
  ).toBeVisible();

  await page.goto(`/restaurants/${RESTAURANT.slug}`);
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", "false");
});
