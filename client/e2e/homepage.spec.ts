import { test, expect } from "@playwright/test";
import { E2E_BASE_URL } from "../src/utils/config";

test("has title", async ({ page }) => {
	await page.goto(`${E2E_BASE_URL}/`);

	await expect(page).toHaveTitle(/Message board/);
})

test("display message form on add message button", async ({ page }) => {
  	await page.goto(`${E2E_BASE_URL}/`);

	await page.getByRole("button", { name: /Add Message/i }).click();

	await expect(page.getByTestId("message-form")).toBeVisible();
})

// * Run in client: npm run dev before running the test command