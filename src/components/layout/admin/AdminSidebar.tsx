"use client";

import { useTranslations } from "next-intl";

import {
    Briefcase,
    FileText,
    FolderOpen,
    Languages,
    LayoutGrid,
    TrendingUp,
    Users,
} from "lucide-react";

import { AppSidebar } from "@/components/layout/shared/AppSidebar";
import { ROUTES } from "@/lib/constants/routes";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

export function AdminSidebar() {
    const t = useTranslations("Admin");
    const { user } = useCurrentUser();

    const navGroups = [
        [
            { href: ROUTES.ADMIN.EMPLOYEES, label: t("employees"), Icon: Users },
            { href: ROUTES.ADMIN.PROJECTS, label: t("projects"), Icon: FolderOpen },
            { href: ROUTES.ADMIN.CVS, label: t("cvs"), Icon: FileText },
        ],
        [
            { href: ROUTES.ADMIN.DEPARTMENTS, label: t("departments"), Icon: LayoutGrid },
            { href: ROUTES.ADMIN.POSITIONS, label: t("positions"), Icon: Briefcase },
            { href: ROUTES.ADMIN.SKILLS, label: t("skills"), Icon: TrendingUp },
            { href: ROUTES.ADMIN.LANGUAGES, label: t("languages"), Icon: Languages },
        ],
    ];

    const initial = user?.email?.[0]?.toUpperCase() ?? "?";
    const displayName = user?.email ?? "";

    return <AppSidebar navGroups={navGroups} userInitial={initial} userDisplayName={displayName} />;
}
