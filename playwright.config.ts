import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: "html",
    timeout: 60_000,
    expect: { timeout: 10_000 },
    use: {
        baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
        trace: "on-first-retry",
        screenshot: "only-on-failure",
    },
    projects: [
        { name: "setup", testMatch: /global-setup\.ts/ },
        {
            name: "auth",
            use: { ...devices["Desktop Chrome"] },
            testMatch: /auth\.spec\.ts/,
            dependencies: ["setup"],
        },
        {
            name: "employee",
            use: {
                ...devices["Desktop Chrome"],
                storageState: "e2e/.auth/employee.json",
            },
            testMatch: /(?:cv-management|user-profile)\.spec\.ts/,
            dependencies: ["setup"],
        },
        {
            name: "admin",
            use: {
                ...devices["Desktop Chrome"],
                storageState: "e2e/.auth/admin.json",
            },
            testMatch: /admin-crud\.spec\.ts/,
            dependencies: ["setup"],
        },
    ],
});
