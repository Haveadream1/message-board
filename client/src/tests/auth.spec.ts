import { test, expect } from "@playwright/test"

test.describe("Authentication Process", () => {
    // Unique username like backend tests
    const uniqueUsername = `User_${Date.now()}`;
    const testPassword = "1234d";
    
    test("should register successfully and redirect to homepage", async ({ page }) => {
        // Go to register page
        await page.goto("http://localhost:5173/auth/login");
        
        // Fill the form inputs
        await page.getByPlaceholder(/Username/).fill(uniqueUsername);
        await page.getByPlaceholder(/Password/).fill(testPassword);

        // Check the checkbox
        await page.getByTestId(/terms-checkbox/).setChecked(true)

        // Submit the registration
        await page.getByTestId(/auth-submit-btn/).click()

        // Validate by checking the homepage url
        await expect(page).toHaveURL("http://localhost:5173/");
    })
})

// * Run in client/server: npm run dev before running the test command