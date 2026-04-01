import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-plugin-prettier/recommended";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    prettier,
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "src/generated/**"]),
    {
        rules: {
            // — TypeScript —
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/consistent-type-imports": [
                "warn",
                { prefer: "type-imports", fixStyle: "inline-type-imports" },
            ],

            // — TypeScript (additional) —
            "@typescript-eslint/no-non-null-assertion": "warn",

            // — General JS —
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "prefer-const": "error",
            "no-var": "error",
            "eqeqeq": ["error", "always"],

            // — React —
            "react/self-closing-comp": "warn",
            "react-hooks/exhaustive-deps": "warn",
            "react/no-array-index-key": "warn",
            "react/jsx-no-useless-fragment": "warn",
        },
    },
]);

export default eslintConfig;
