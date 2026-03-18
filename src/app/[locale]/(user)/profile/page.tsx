"use client";

import { useTranslations } from "next-intl";

import { ProfileForm } from "@/components/features/profile/ProfileForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default function ProfilePage() {
    const t = useTranslations("User");

    return (
        <div>
            <PageHeader title={t("profile")} />
            <div className="px-6">
                <ProfileForm />
            </div>
        </div>
    );
}
