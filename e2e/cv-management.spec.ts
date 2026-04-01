import { test, expect } from "@playwright/test";

import { uniqueName } from "./helpers/utils";

test.describe("CV Management", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/cvs");
        await page.waitForURL(/\/cvs/);
    });

    test("displays the CV list page", async ({ page }) => {
        await expect(page.getByRole("button", { name: "Create CV" })).toBeVisible();
    });

    test("shows empty state when no CVs exist", async ({ page }) => {
        const hasCVs = await page.locator("table tbody tr").count();
        if (hasCVs === 0) {
            await expect(page.getByText("No added CVs yet")).toBeVisible();
        }
    });

    test("can create a new CV", async ({ page }) => {
        const cvName = uniqueName("E2ECV");

        await page.getByRole("button", { name: "Create CV" }).click();

        const dialog = page.getByRole("dialog");
        await expect(dialog).toBeVisible();

        await dialog.locator("input").first().fill(cvName);
        await dialog.locator("input").nth(1).fill("Computer Science");
        await dialog.locator("textarea").fill("E2E test CV description");

        await dialog.getByRole("button", { name: "Create" }).click();

        await expect(dialog).not.toBeVisible({ timeout: 10_000 });

        await page.getByPlaceholder("Search").fill(cvName);
        await page.waitForTimeout(500);
        await expect(page.getByText(cvName)).toBeVisible({ timeout: 10_000 });
    });

    test("can search CVs by name", async ({ page }) => {
        const searchInput = page.getByPlaceholder("Search");
        await searchInput.fill("E2ECV");
        await page.waitForTimeout(500);
        const rows = page.locator("table tbody tr");
        const count = await rows.count();
        await expect(searchInput).toHaveValue("E2ECV");
        if (count > 0) {
            await expect(rows.first()).toContainText("E2ECV");
        }
    });
});
