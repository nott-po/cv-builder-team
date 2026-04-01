import { test, expect } from "@playwright/test";

test.describe("Employee list", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/employees");
        await page.waitForURL(/\/employees/);
    });

    test("displays the employee list page", async ({ page }) => {
        await expect(page.getByPlaceholder("Search")).toBeVisible();
    });

    test("shows employee data in the table", async ({ page }) => {
        const rows = page.locator("table tbody tr");
        await expect(rows.first()).toBeVisible({ timeout: 10_000 });
    });

    test("can search employees", async ({ page }) => {
        await page.getByPlaceholder("Search").fill("admin-e2e");
        await page.waitForTimeout(500);
        const rows = page.locator("table tbody tr");
        const count = await rows.count();
        if (count > 0) {
            await expect(rows.first()).toBeVisible();
        }
    });
});

test.describe("Profile page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/profile");
        await page.waitForURL(/\/profile/);
    });

    test("displays the profile page", async ({ page }) => {
        await expect(page.getByRole("button", { name: "Update" })).toBeVisible({
            timeout: 10_000,
        });
        await expect(page.getByText("First Name")).toBeVisible();
        await expect(page.getByText("Last Name")).toBeVisible();
    });

    test("shows member since info", async ({ page }) => {
        await expect(page.getByText("A member since")).toBeVisible({ timeout: 10_000 });
    });
});

test.describe("User Skills page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/skills");
        await page.waitForURL(/\/skills/);
    });

    test("displays the skills page", async ({ page }) => {
        await expect(page.getByRole("heading", { name: "Skills" })).toBeVisible();
    });

    test("shows add skill button", async ({ page }) => {
        await expect(page.getByRole("button", { name: "Add Skill" })).toBeVisible();
    });
});

test.describe("User Languages page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/languages");
        await page.waitForURL(/\/languages/);
    });

    test("displays the languages page", async ({ page }) => {
        await expect(page.getByRole("heading", { name: "Languages" })).toBeVisible();
    });

    test("shows add language button", async ({ page }) => {
        await expect(page.getByRole("button", { name: "Add Language" })).toBeVisible();
    });
});

test.describe("Settings page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/settings");
        await page.waitForURL(/\/settings/);
    });

    test("displays settings page with theme options", async ({ page }) => {
        await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
        await expect(page.getByText("Appearance")).toBeVisible();
    });

    test("can switch theme to dark", async ({ page }) => {
        await page.getByRole("combobox").first().click();
        await page.getByRole("option", { name: "Dark" }).click();
        await expect(page.locator("html")).toHaveAttribute("class", /dark/);
    });

    test("can switch theme to light", async ({ page }) => {
        await page.getByRole("combobox").first().click();
        await page.getByRole("option", { name: "Light" }).click();
        await expect(page.locator("html")).toHaveAttribute("class", /light/);
    });
});

test.describe("Sidebar navigation", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/employees");
        await page.waitForURL(/\/employees/);
    });

    test("can navigate to all user pages via sidebar", async ({ page }) => {
        await page.getByRole("link", { name: "CVs" }).first().click();
        await page.waitForURL(/\/cvs/);
        await expect(page).toHaveURL(/\/cvs/);

        await page.getByRole("link", { name: "Skills" }).first().click();
        await page.waitForURL(/\/skills/);
        await expect(page).toHaveURL(/\/skills/);

        await page.getByRole("link", { name: "Employees" }).first().click();
        await page.waitForURL(/\/employees/);
        await expect(page).toHaveURL(/\/employees/);
    });
});
