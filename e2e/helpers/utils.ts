import { type Page, expect } from "@playwright/test";

export function uniqueName(prefix: string) {
    return `${prefix}-${Date.now()}`;
}

export async function waitForToast(page: Page, text: string | RegExp) {
    const toast = page.locator("[data-sonner-toast]").filter({ hasText: text });
    await expect(toast.first()).toBeVisible({ timeout: 10_000 });
}

export async function fillAdminNameModal(
    page: Page,
    name: string,
    submitLabel: "Create" | "Save" = "Create",
) {
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("textbox").fill(name);
    await dialog.getByRole("button", { name: submitLabel }).click();
}

export async function openRowActions(page: Page, rowText: string) {
    const row = page.locator("tr").filter({ hasText: rowText });
    await row
        .getByRole("button")
        .filter({ has: page.locator("svg") })
        .click();
}

export async function confirmDelete(page: Page) {
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Confirm" }).click();
}
