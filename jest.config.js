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
        "!src/app/**",
        "!src/e2e/**",
        "!src/**/__tests__/**",
        "!src/**/__mocks__/**",
        "!src/types/**",
        "!src/components/ui/**",
        "!src/proxy.ts",
    ],
    coverageThreshold: {
        global: {
            lines: 80,
            branches: 80,
            functions: 80,
        },
    },
};

module.exports = createJestConfig(customConfig);
