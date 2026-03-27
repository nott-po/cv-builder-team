import { test as setup, expect } from "@playwright/test";

import { TEST_ADMIN, TEST_EMPLOYEE } from "./helpers/auth";

setup("authenticate employee", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Email").fill(TEST_EMPLOYEE.email);
    await page.getByPlaceholder("Password").fill(TEST_EMPLOYEE.password);
    await page.getByRole("button", { name: "Log In" }).click();
    await page.waitForURL(/\/employees/, { timeout: 15_000 });
    await expect(page).toHaveURL(/\/employees/);
    await page.context().storageState({ path: "e2e/.auth/employee.json" });
});

setup("authenticate admin", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Email").fill(TEST_ADMIN.email);
    await page.getByPlaceholder("Password").fill(TEST_ADMIN.password);
    await page.getByRole("button", { name: "Log In" }).click();
    await page.waitForURL(/\/admin/, { timeout: 15_000 });
    await expect(page).toHaveURL(/\/admin/);
    await page.context().storageState({ path: "e2e/.auth/admin.json" });
});
