import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
	await page.goto("http://localhost:5173/");

	await expect(page).toHaveTitle(/Message board/);
})

test("display message form on add message button", async ({ page }) => {
  	await page.goto("http://localhost:5173/");

	await page.getByRole("button", { name: /Add Message/i }).click();

	await expect(page.getByTestId("message-form")).toBeVisible();
})

// * Run in client: npm run dev before running the test command