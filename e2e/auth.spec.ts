import { test, expect } from "@playwright/test";

import { loginAsAdmin, loginAsEmployee, TEST_EMPLOYEE } from "./helpers/auth";

test.describe("Login page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/login");
    });

    test("renders the login form", async ({ page }) => {
        await expect(page.getByPlaceholder("Email")).toBeVisible();
        await expect(page.getByPlaceholder("Password")).toBeVisible();
        await expect(page.getByRole("button", { name: "Log In" })).toBeVisible();
    });

    test("shows validation errors for empty fields", async ({ page }) => {
        await page.getByRole("button", { name: "Log In" }).click();

        await expect(page.getByText("Please enter a valid email address")).toBeVisible();
    });

    test("shows validation error for invalid email", async ({ page }) => {
        await page.getByPlaceholder("Email").fill("not-an-email");
        await page.getByPlaceholder("Password").fill("somepassword");
        await page.getByRole("button", { name: "Log In" }).click();
        await expect(page.getByText("Please enter a valid email address")).toBeVisible();
    });

    test("shows validation error for short password", async ({ page }) => {
        await page.getByPlaceholder("Email").fill("test@test.com");
        await page.getByPlaceholder("Password").fill("123");
        await page.getByRole("button", { name: "Log In" }).click();
        await expect(page.getByText("Password must be at least")).toBeVisible();
    });

    test("shows error for wrong credentials", async ({ page }) => {
        await page.getByPlaceholder("Email").fill("nonexistent@test.com");
        await page.getByPlaceholder("Password").fill("WrongPass1!");
        await page.getByRole("button", { name: "Log In" }).click();

        await expect(page.locator(".text-destructive")).toBeVisible({
            timeout: 10_000,
        });
    });

    test("logs in as employee and redirects to /employees", async ({ page }) => {
        await loginAsEmployee(page);
        await expect(page).toHaveURL(/\/employees/);
    });

    test("logs in as admin and redirects to /admin/employees", async ({ page }) => {
        await loginAsAdmin(page);
        await expect(page).toHaveURL(/\/admin\/employees/);
    });

    test("has link to signup page", async ({ page }) => {
        await page.getByText("Create an account").click();
        await expect(page).toHaveURL(/\/signup/);
    });
});

test.describe("Signup page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/login");
        // Navigate to signup via the tab
        await page.getByRole("link", { name: "Sign Up" }).click();
        await page.waitForURL(/\/signup/);
    });

    test("renders the signup form", async ({ page }) => {
        await expect(page.getByPlaceholder("Email")).toBeVisible();
        await expect(page.getByPlaceholder("Password", { exact: true })).toBeVisible();
        await expect(page.getByPlaceholder("Confirm Password")).toBeVisible();
        await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
    });

    test("shows validation for weak password", async ({ page }) => {
        await page.getByPlaceholder("Email").fill("weakpass@test.com");
        await page.getByPlaceholder("Password", { exact: true }).fill("short");
        await page.getByPlaceholder("Confirm Password").fill("short");
        await page.getByRole("button", { name: "Sign Up" }).click();
        await expect(page.getByText(/must be at least 8 characters/)).toBeVisible();
    });

    test("shows error when passwords do not match", async ({ page }) => {
        await page.getByPlaceholder("Email").fill("mismatch@test.com");
        await page.getByPlaceholder("Password", { exact: true }).fill("Test1234!");
        await page.getByPlaceholder("Confirm Password").fill("Different1!");
        await page.getByRole("button", { name: "Sign Up" }).click();
        await expect(page.getByText("Passwords do not match")).toBeVisible();
    });

    test("shows error for already taken email", async ({ page }) => {
        await page.getByPlaceholder("Email").fill(TEST_EMPLOYEE.email);
        await page.getByPlaceholder("Password", { exact: true }).fill("Test1234!");
        await page.getByPlaceholder("Confirm Password").fill("Test1234!");
        await page.getByRole("button", { name: "Sign Up" }).click();

        await expect(page.locator(".text-destructive")).toBeVisible({
            timeout: 10_000,
        });
    });

    test("has link to login page", async ({ page }) => {
        await page.getByRole("link", { name: "Log In" }).click();
        await expect(page).toHaveURL(/\/login/);
    });
});

test.describe("Logout", () => {
    test("employee can log out", async ({ page }) => {
        await loginAsEmployee(page);
        await page.getByRole("button", { name: "Log out" }).click();
        await page.waitForURL(/\/login/);
        await expect(page).toHaveURL(/\/login/);
    });
});

test.describe("Route protection", () => {
    test("unauthenticated user is redirected to login", async ({ page }) => {
        await page.goto("/employees");
        await page.waitForURL(/\/login/);
        await expect(page).toHaveURL(/\/login/);
    });

    test("unauthenticated user cannot access admin routes", async ({ page }) => {
        await page.goto("/admin/employees");
        await page.waitForURL(/\/login/);
        await expect(page).toHaveURL(/\/login/);
    });

    test("employee cannot access admin routes", async ({ page }) => {
        await loginAsEmployee(page);
        await page.goto("/admin/employees");

        await page.waitForURL(/(?!.*\/admin)/);
        await expect(page).not.toHaveURL(/\/admin/);
    });
});
