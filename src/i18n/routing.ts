import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: ["en", "pl"],
    defaultLocale: "en",
    localePrefix: "as-needed",
    localeDetection: false,
});

export const { Link, useRouter, usePathname } = createNavigation(routing);
