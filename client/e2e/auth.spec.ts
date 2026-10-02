import { test, expect } from "@playwright/test";
import { E2E_BASE_URL } from "../src/utils/config";

test.describe("Authentication Process", () => {
    // Unique username like backend tests
    const uniqueUsername = `UserqweT_${Date.now()}`;
    const testPassword = "1231212ad4d";
    
    test("should register successfully and redirect to homepage", async ({ page }) => {
        // Go to register page
        await page.goto(`${E2E_BASE_URL}/auth/login`);
        
        // Fill the form inputs
        await page.getByPlaceholder(/Username/).fill(`${uniqueUsername}`);
        await page.getByPlaceholder(/Password/).fill(`${testPassword}`);

        // Check the checkbox
        await page.getByTestId(/terms-checkbox/).setChecked(true);

        // Submit the registration
        await page.getByTestId(/auth-submit-btn/).click();

        // Validate by getting the homepage title
        await expect(page.getByText(/Conversations & Threads/i))
    })
})

// * Run in client/server: npm run dev before running the test command