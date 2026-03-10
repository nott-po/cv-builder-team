import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation"

export const routing = defineRouting({
    locales: ["en", "pl"],
    defaultLocale: "en",
    localePrefix: "as-needed",
    localeDetection: false,
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
