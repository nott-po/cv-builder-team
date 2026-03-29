import { type Page } from "@playwright/test";

export const TEST_EMPLOYEE = {
    email: "employee-e2e@test.com",
    password: "Test1234!",
};

export const TEST_ADMIN = {
    email: "admin-e2e@test.com",
    password: "Test1234!",
};

export async function loginAs(page: Page, credentials: { email: string; password: string }) {
    await page.goto("/login");
    await page.getByPlaceholder("Email").fill(credentials.email);
    await page.getByPlaceholder("Password").fill(credentials.password);
    await page.getByRole("button", { name: "Log In" }).click();

    await page.waitForURL(/(?!.*\/login)/, { timeout: 10_000 });
}

export async function loginAsEmployee(page: Page) {
    await loginAs(page, TEST_EMPLOYEE);
}

export async function loginAsAdmin(page: Page) {
    await loginAs(page, TEST_ADMIN);
}

export async function logout(page: Page) {
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL(/\/login/);
}
