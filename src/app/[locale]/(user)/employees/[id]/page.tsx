"use client";
import { useState } from "react";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { User } from "lucide-react";

import { ProfileLanguagesPage } from "@/app/[locale]/(user)/profile/languages/page";
import { ProfileSkillsPage } from "@/app/[locale]/(user)/profile/skills/page";
import { EmployeeProfile } from "@/components/features/employees/EmployeeProfile";
import { UserHeader } from "@/components/layout/user/UserHeader";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserData } from "@/lib/hooks/useUserData";

export default function EmployeeDetailsPage() {
    const [currentMode, setCurrentMode] = useState<"profile" | "skills" | "language">("profile");
    const params = useParams();
    const employeeId = params?.id as string;

    const { data, isLoading, isError } = useUserData(employeeId);
    const t = useTranslations("User");

    if ((!isLoading && !data) || isError) {
        return <ErrorMessage message={t("error")} />;
    }

    return (
        <div>
            {isLoading ? (
                <div className="flex justify-start gap-3 px-11 pt-3 pb-3">
                    <Skeleton className="mb-2 h-4 w-30" />
                    <Skeleton className="mb-2 h-4 w-50" />
                    <Skeleton className="mb-2 h-4 w-20" />
                </div>
            ) : (
                <PageHeader
                    items={[
                        { label: t("employees"), href: "/employees" },
                        { label: data?.email, href: `/employees/${employeeId}`, Icon: User },
                        { label: t(currentMode) },
                    ]}
                />
            )}

            <div className="px-6">
                <div className="mb-4">
                    <UserHeader mode={currentMode} onModeChange={setCurrentMode} />
                </div>
                <div>
                    {currentMode === "profile" && <EmployeeProfile />}
                    {currentMode === "skills" && (
                        <div>
                            <ProfileSkillsPage userId={employeeId} />
                        </div>
                    )}
                    {currentMode === "language" && (
                        <div>
                            <ProfileLanguagesPage userId={employeeId} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
