"use client";

import { useTranslations } from "next-intl";

import { FileText, Globe, TrendingUp, Users } from "lucide-react";

import { Link, usePathname } from "@/i18n/routing";
import { ROUTES } from "@/lib/constants/routes";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { href: ROUTES.EMPLOYEES, labelKey: "employees", Icon: Users },
    { href: ROUTES.SKILLS, labelKey: "skills", Icon: TrendingUp },
    { href: ROUTES.LANGUAGES, labelKey: "languages", Icon: Globe },
    { href: ROUTES.CVS, labelKey: "cvs", Icon: FileText },
] as const;

export function UserSidebar() {
    const t = useTranslations("User");
    const pathname = usePathname();
    const { user } = useCurrentUser();

    const initial = user?.email?.[0]?.toUpperCase() ?? "?";
    const displayName = user?.email ?? "";

    return (
        <aside className="bg-surface flex h-screen w-50 shrink-0 flex-col pb-4">
            {/* Nav */}
            <nav className="mt-11 flex flex-col gap-3.5">
                {NAV_ITEMS.map(({ href, labelKey, Icon }) => {
                    const isActive = pathname === href || pathname.startsWith(href + "/");
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex h-14 items-center rounded-tr-full rounded-br-full transition-colors",
                                isActive
                                    ? "bg-hover-sm text-basic-text"
                                    : "text-text-secondary hover:bg-hover-xs",
                            )}
                        >
                            <Icon className="ml-4 size-6 shrink-0" />
                            <span className="text-body tracking-standard ml-4 font-normal">
                                {t(labelKey)}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="flex-1" />

            {/* User profile */}
            <div className="flex h-14 items-center overflow-hidden rounded-tr-full rounded-br-full">
                <div className="bg-red-primary ml-2 flex size-10 shrink-0 items-center justify-center rounded-full">
                    <span className="text-title text-surface leading-none font-medium uppercase">
                        {initial}
                    </span>
                </div>
                <span className="text-body text-basic-text tracking-standard ml-3 truncate pr-2">
                    {displayName}
                </span>
            </div>
        </aside>
    );
}
