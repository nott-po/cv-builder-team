import { test, expect } from "@playwright/test";

import { uniqueName, fillAdminNameModal, openRowActions, confirmDelete } from "./helpers/utils";

test.describe("Admin panel", () => {
    test.describe("Admin navigation", () => {
        test("can navigate to all admin pages via sidebar", async ({ page }) => {
            await page.goto("/admin/employees");
            await page.waitForURL(/\/admin\/employees/);

            const pages = [
                { name: "Departments", url: /\/admin\/departments/ },
                { name: "Positions", url: /\/admin\/positions/ },
                { name: "Skills", url: /\/admin\/skills/ },
                { name: "Languages", url: /\/admin\/languages/ },
                { name: "Projects", url: /\/admin\/projects/ },
                { name: "CVs", url: /\/admin\/cvs/ },
                { name: "Employees", url: /\/admin\/employees/ },
            ];

            for (const p of pages) {
                await page.getByRole("link", { name: p.name }).first().click();
                await page.waitForURL(p.url);
                await expect(page).toHaveURL(p.url);
            }
        });
    });

    test.describe("Departments CRUD", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/admin/departments");
            await page.waitForURL(/\/admin\/departments/);
        });

        test("displays department list page", async ({ page }) => {
            await expect(page.getByRole("button", { name: "Create Department" })).toBeVisible();
        });

        test("can create a department", async ({ page }) => {
            const name = uniqueName("E2EDept");
            await page.getByRole("button", { name: "Create Department" }).click();
            await fillAdminNameModal(page, name);
            await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 10_000 });
            await page.getByPlaceholder("Name").fill(name);
            await page.waitForTimeout(500);
            await expect(page.getByText(name)).toBeVisible({ timeout: 10_000 });
        });

        test("can edit a department", async ({ page }) => {
            const original = uniqueName("E2EDeptEdit");
            await page.getByRole("button", { name: "Create Department" }).click();
            await fillAdminNameModal(page, original);
            await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 10_000 });

            await page.getByPlaceholder("Name").fill(original);
            await page.waitForTimeout(500);
            await expect(page.getByText(original)).toBeVisible({ timeout: 10_000 });

            await openRowActions(page, original);
            await page.getByRole("menuitem", { name: "Edit" }).click();

            const updated = uniqueName("E2EDeptUpdated");
            await fillAdminNameModal(page, updated, "Save");
            await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 10_000 });

            await page.getByPlaceholder("Name").fill(updated);
            await page.waitForTimeout(500);
            await expect(page.getByText(updated)).toBeVisible({ timeout: 10_000 });
        });

        test("can delete a department", async ({ page }) => {
            const name = uniqueName("E2EDeptDel");
            await page.getByRole("button", { name: "Create Department" }).click();
            await fillAdminNameModal(page, name);
            await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 10_000 });

            await page.getByPlaceholder("Name").fill(name);
            await page.waitForTimeout(500);
            await expect(page.getByText(name)).toBeVisible({ timeout: 10_000 });

            await openRowActions(page, name);
            await page.getByRole("menuitem", { name: "Delete" }).click();
            await confirmDelete(page);

            await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 5_000 });
            await expect(page.locator("table").getByText(name).first()).not.toBeVisible({
                timeout: 10_000,
            });
        });
    });

    test.describe("Positions CRUD", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/admin/positions");
            await page.waitForURL(/\/admin\/positions/);
        });

        test("displays position list page", async ({ page }) => {
            await expect(page.getByRole("button", { name: "Create Position" })).toBeVisible();
        });

        test("can create a position", async ({ page }) => {
            const name = uniqueName("E2EPos");
            await page.getByRole("button", { name: "Create Position" }).click();
            await fillAdminNameModal(page, name);
            await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 10_000 });

            await page.getByPlaceholder("Name").fill(name);
            await page.waitForTimeout(500);
            await expect(page.getByText(name)).toBeVisible({ timeout: 10_000 });
        });

        test("can edit a position", async ({ page }) => {
            const original = uniqueName("E2EPosEdit");
            await page.getByRole("button", { name: "Create Position" }).click();
            await fillAdminNameModal(page, original);
            await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 10_000 });

            await page.getByPlaceholder("Name").fill(original);
            await page.waitForTimeout(500);
            await expect(page.getByText(original)).toBeVisible({ timeout: 10_000 });

            await openRowActions(page, original);
            await page.getByRole("menuitem", { name: "Edit" }).click();

            const updated = uniqueName("E2EPosUpdated");
            await fillAdminNameModal(page, updated, "Save");
            await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 10_000 });

            await page.getByPlaceholder("Name").fill(updated);
            await page.waitForTimeout(500);
            await expect(page.getByText(updated)).toBeVisible({ timeout: 10_000 });
        });

        test("can delete a position", async ({ page }) => {
            const name = uniqueName("E2EPosDel");
            await page.getByRole("button", { name: "Create Position" }).click();
            await fillAdminNameModal(page, name);
            await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 10_000 });

            await page.getByPlaceholder("Name").fill(name);
            await page.waitForTimeout(500);
            await expect(page.getByText(name)).toBeVisible({ timeout: 10_000 });

            await openRowActions(page, name);
            await page.getByRole("menuitem", { name: "Delete" }).click();
            await confirmDelete(page);

            await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 5_000 });
            await expect(page.locator("table").getByText(name).first()).not.toBeVisible({
                timeout: 10_000,
            });
        });
    });

    test.describe("Skills CRUD", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/admin/skills");
            await page.waitForURL(/\/admin\/skills/);
        });

        test("displays skill list page", async ({ page }) => {
            await expect(page.getByRole("button", { name: "Create Skill" })).toBeVisible();
        });

        test("can create a skill", async ({ page }) => {
            const name = uniqueName("E2ESkill");
            await page.getByRole("button", { name: "Create Skill" }).click();
            await fillAdminNameModal(page, name);
            await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 10_000 });

            await page.getByPlaceholder("Name").fill(name);
            await page.waitForTimeout(500);
            await expect(page.getByText(name)).toBeVisible({ timeout: 10_000 });
        });

        test("can delete a skill", async ({ page }) => {
            const name = uniqueName("E2ESkillDel");
            await page.getByRole("button", { name: "Create Skill" }).click();
            await fillAdminNameModal(page, name);
            await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 10_000 });

            await page.getByPlaceholder("Name").fill(name);
            await page.waitForTimeout(500);
            await expect(page.getByText(name)).toBeVisible({ timeout: 10_000 });

            await openRowActions(page, name);
            await page.getByRole("menuitem", { name: "Delete" }).click();
            await confirmDelete(page);

            await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 5_000 });
            await expect(page.locator("table").getByText(name).first()).not.toBeVisible({
                timeout: 10_000,
            });
        });
    });

    test.describe("Languages CRUD", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/admin/languages");
            await page.waitForURL(/\/admin\/languages/);
        });

        test("displays language list page", async ({ page }) => {
            await expect(page.getByRole("button", { name: "Create Language" })).toBeVisible();
        });

        test("can create a language", async ({ page }) => {
            const name = uniqueName("E2ELang");
            const ts = Date.now();

            const iso2 =
                String.fromCharCode(65 + (ts % 26)) +
                String.fromCharCode(65 + (Math.floor(ts / 26) % 26));

            await page.getByRole("button", { name: "Create Language" }).click();

            const dialog = page.getByRole("dialog");
            await expect(dialog).toBeVisible();

            const inputs = dialog.locator("input");
            await inputs.nth(0).fill(iso2);
            await inputs.nth(1).fill(name);
            await inputs.nth(2).fill(name);

            await dialog.getByRole("button", { name: "Create" }).click();
            await expect(dialog).not.toBeVisible({ timeout: 10_000 });

            await page.getByPlaceholder("Name").fill(name);
            await page.waitForTimeout(500);

            await expect(page.getByText(name).first()).toBeVisible({ timeout: 10_000 });
        });

        test("can delete a language", async ({ page }) => {
            const name = uniqueName("E2ELangDel");
            const ts = Date.now();
            const iso2 =
                String.fromCharCode(65 + ((ts + 1) % 26)) +
                String.fromCharCode(65 + (Math.floor((ts + 1) / 26) % 26));

            await page.getByRole("button", { name: "Create Language" }).click();

            const dialog = page.getByRole("dialog");
            await expect(dialog).toBeVisible();

            const inputs = dialog.locator("input");
            await inputs.nth(0).fill(iso2);
            await inputs.nth(1).fill(name);
            await inputs.nth(2).fill(name);

            await dialog.getByRole("button", { name: "Create" }).click();
            await expect(dialog).not.toBeVisible({ timeout: 10_000 });

            await page.getByPlaceholder("Name").fill(name);
            await page.waitForTimeout(500);

            await expect(page.getByText(name).first()).toBeVisible({ timeout: 10_000 });

            await openRowActions(page, name);
            await page.getByRole("menuitem", { name: "Delete" }).click();
            await confirmDelete(page);

            await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 5_000 });
            await expect(page.locator("table").getByText(name).first()).not.toBeVisible({
                timeout: 10_000,
            });
        });
    });

    test.describe("Projects CRUD", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/admin/projects");
            await page.waitForURL(/\/admin\/projects/);
        });

        test("displays project list page", async ({ page }) => {
            await expect(page.getByRole("button", { name: "Create Project" })).toBeVisible();
        });

        test("can create a project", async ({ page }) => {
            const name = uniqueName("E2EProj");
            await page.getByRole("button", { name: "Create Project" }).click();

            const dialog = page.getByRole("dialog");
            await expect(dialog).toBeVisible();

            await dialog.getByPlaceholder("Name").fill(name);
            await dialog.getByPlaceholder("Domain").fill("E2E Testing");
            await dialog.locator("input[type='date']").first().fill("2024-01-01");
            await dialog.locator("textarea").fill("E2E test project");

            await dialog.getByRole("button", { name: "Create" }).click();
            await expect(dialog).not.toBeVisible({ timeout: 10_000 });

            await page.getByPlaceholder("Name").fill(name);
            await page.waitForTimeout(500);
            await expect(page.getByText(name)).toBeVisible({ timeout: 10_000 });
        });

        test("can delete a project", async ({ page }) => {
            const name = uniqueName("E2EProjDel");
            await page.getByRole("button", { name: "Create Project" }).click();

            const dialog = page.getByRole("dialog");
            await expect(dialog).toBeVisible();

            await dialog.getByPlaceholder("Name").fill(name);
            await dialog.getByPlaceholder("Domain").fill("E2E Testing");
            await dialog.locator("input[type='date']").first().fill("2024-01-01");
            await dialog.locator("textarea").fill("To be deleted");

            await dialog.getByRole("button", { name: "Create" }).click();
            await expect(dialog).not.toBeVisible({ timeout: 10_000 });

            await page.getByPlaceholder("Name").fill(name);
            await page.waitForTimeout(500);
            await expect(page.getByText(name)).toBeVisible({ timeout: 10_000 });

            await openRowActions(page, name);
            await page.getByRole("menuitem", { name: "Delete" }).click();
            await confirmDelete(page);

            await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 5_000 });
            await expect(page.locator("table").getByText(name).first()).not.toBeVisible({
                timeout: 10_000,
            });
        });
    });

    test.describe("Employee management", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/admin/employees");
            await page.waitForURL(/\/admin\/employees/);
        });

        test("displays employee list with Create User button", async ({ page }) => {
            await expect(page.getByRole("button", { name: "Create User" })).toBeVisible();
            await expect(page.getByPlaceholder("Search")).toBeVisible();
        });

        test("shows employees in the table", async ({ page }) => {
            const rows = page.locator("table tbody tr");
            await expect(rows.first()).toBeVisible({ timeout: 10_000 });
        });

        test("can search employees", async ({ page }) => {
            await page.getByPlaceholder("Search").fill("employee-e2e");
            await page.waitForTimeout(500);
            const rows = page.locator("table tbody tr");
            const count = await rows.count();
            if (count > 0) {
                await expect(rows.first()).toContainText("employee-e2e");
            }
        });

        test("can open create user modal", async ({ page }) => {
            await page.getByRole("button", { name: "Create User" }).click();
            const dialog = page.getByRole("dialog");
            await expect(dialog).toBeVisible();
            await expect(dialog.getByText("Create user")).toBeVisible();

            await expect(dialog.getByPlaceholder("Email")).toBeVisible();
            await expect(dialog.getByPlaceholder("Password")).toBeVisible();

            await dialog.getByRole("button", { name: "Cancel" }).click();
            await expect(dialog).not.toBeVisible();
        });

        test("can create a new employee", async ({ page }) => {
            const email = `e2ecreated${Date.now()}@test.com`;
            await page.getByRole("button", { name: "Create User" }).click();

            const dialog = page.getByRole("dialog");
            await dialog.getByPlaceholder("Email").fill(email);
            await dialog.getByPlaceholder("Password").fill("Test1234!");

            await dialog.getByRole("button", { name: "Create" }).click();
            await expect(dialog).not.toBeVisible({ timeout: 10_000 });
        });

        test("shows error for duplicate email", async ({ page }) => {
            await page.getByRole("button", { name: "Create User" }).click();
            const dialog = page.getByRole("dialog");

            await dialog.getByPlaceholder("Email").fill("employee-e2e@test.com");
            await dialog.getByPlaceholder("Password").fill("Test1234!");
            await dialog.getByRole("button", { name: "Create" }).click();

            await expect(dialog.locator(".text-destructive")).toBeVisible({
                timeout: 10_000,
            });
        });
    });

    test.describe("Admin CVs", () => {
        test("can view CVs list as admin", async ({ page }) => {
            await page.goto("/admin/cvs");
            await page.waitForURL(/\/admin\/cvs/);
            await expect(page.getByPlaceholder("Search")).toBeVisible();
        });
    });

    test.describe("Admin Settings", () => {
        test("can access admin settings", async ({ page }) => {
            await page.goto("/admin/settings");
            await page.waitForURL(/\/admin\/settings/);
            await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
        });
    });
});
