/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require("next/jest.js");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customConfig = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^next-intl$": "<rootDir>/src/__mocks__/next-intl.tsx",
    },
    testPathIgnorePatterns: ["<rootDir>/e2e/", "<rootDir>/.next/"],

    coverageProvider: "v8",

    coverageReporters: ["text", "text-summary", "html"],

    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/*.d.ts",
        "!src/generated/**",
        "!src/app/**/page.tsx",
        "!src/app/**/layout.tsx",
        "!src/app/**/loading.tsx",
        "!src/app/**/not-found.tsx",
        "!src/app/**/error.tsx",
        "!src/app/providers.tsx",
        "!src/e2e/**",
        "!src/**/__tests__/**",
        "!src/**/__mocks__/**",
        "!src/types/**",
        "!src/components/ui/**",
        "!src/proxy.ts",
        "!src/components/features/cvs/**",
        "!src/**/*Skeleton.tsx",
        "!src/lib/utils/pdf.ts",
        "!src/test-utils.tsx",
        "!src/i18n/**",
        "!src/lib/graphql/fetcher.ts",
        "!src/lib/graphql/fragments/**",
        "!src/lib/graphql/operations/auth.ts",
        "!src/lib/auth/tokens.ts",
        "!src/lib/auth/auth.ts",
        "!src/lib/api/backend.ts",
        "!src/app/api/auth/login/route.ts",
        "!src/app/api/auth/signup/route.ts",
        "!src/components/features/profile/ProfileForm.tsx",
        "!src/components/features/projects/admin/EnvironmentSelect.tsx",
        "!src/components/features/skills/admin/SkillCategorySelect.tsx",
    ],
    coverageThreshold: {
        global: {
            lines: 80,
            branches: 80,
            functions: 55,
        },
    },
};

module.exports = createJestConfig(customConfig);
