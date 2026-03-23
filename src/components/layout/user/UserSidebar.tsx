"use client";

import { useTranslations } from "next-intl";

import { FileText, Globe, Settings, TrendingUp, Users } from "lucide-react";

import { AppSidebar } from "@/components/layout/shared/AppSidebar";
import { ROUTES } from "@/lib/constants/routes";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

export function UserSidebar() {
    const t = useTranslations("User");
    const { user } = useCurrentUser();

    const navGroups = [
        [
            { href: ROUTES.EMPLOYEES, label: t("employees"), Icon: Users },
            { href: ROUTES.SKILLS, label: t("skills"), Icon: TrendingUp },
            { href: ROUTES.LANGUAGES, label: t("languages"), Icon: Globe },
            { href: ROUTES.CVS, label: t("cvs"), Icon: FileText },
        ],
        [{ href: ROUTES.SETTINGS, label: t("settings"), Icon: Settings }],
    ];

    const initial = user?.email?.[0]?.toUpperCase() ?? "?";
    const displayName = user?.email ?? "";

    return <AppSidebar navGroups={navGroups} userInitial={initial} userDisplayName={displayName} />;
}
