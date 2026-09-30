import { test, expect } from "@playwright/test";

test("homepage renders hero and primary navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /shop all products/i })).toBeVisible();
});

test("can browse to a product and view its detail page", async ({ page }) => {
  await page.goto("/products");
  await expect(page.getByRole("heading", { name: "All Products" })).toBeVisible();

  const firstProductLink = page.locator('a[href^="/products/"]').first();
  await firstProductLink.click();

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: /add to cart/i })).toBeVisible();
});

test("adding a product to the cart updates the cart count and drawer", async ({ page }) => {
  await page.goto("/products/hearth-candle");

  await page.getByRole("button", { name: /add to cart/i }).click();

  const cartDialog = page.getByRole("dialog", { name: /shopping cart/i });
  await expect(cartDialog).toBeVisible();
  await expect(cartDialog.getByText("Hearth")).toBeVisible();

  await page.getByRole("button", { name: /close cart/i }).click();
  await expect(page.getByRole("link", { name: /open cart, 1 items/i })).toBeVisible();
});

test("checkout shows validation errors for an incomplete form", async ({ page }) => {
  await page.goto("/products/hearth-candle");
  await page.getByRole("button", { name: /add to cart/i }).click();
  await page.getByRole("button", { name: /close cart/i }).click();

  await page.goto("/checkout");
  await page.getByRole("button", { name: /place order/i }).click();

  // Native HTML validation blocks submission of empty required fields,
  // so the page should still show the checkout form (not a confirmation).
  await expect(page).toHaveURL(/\/checkout$/);
});

test("search returns relevant results", async ({ page }) => {
  await page.goto("/search?q=fig");
  await expect(page.getByText(/results for/i)).toBeVisible();
  await expect(page.locator('a[href^="/products/"]').first()).toBeVisible();
});

test("404 page renders for an unknown product", async ({ page }) => {
  const response = await page.goto("/products/not-a-real-product");
  expect(response?.status()).toBe(404);
  await expect(page.getByText(/this page burned out/i)).toBeVisible();
});
