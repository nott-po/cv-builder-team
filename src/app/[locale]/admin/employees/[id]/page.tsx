"use client";
import { useState } from "react";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { ChevronRight, User } from "lucide-react";

import { EmployeeProfile } from "@/components/features/employees/EmployeeProfile";
import { UserHeader } from "@/components/layout/user/UserHeader";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/routing";
import { useUserData } from "@/lib/hooks/useUserData";

export default function AdminEmployeeEditPage() {
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
            <div className="mb-2 px-6 pt-4 pb-1">
                <h1 className="text-input-default tracking-standard flex items-center gap-3 px-5">
                    <Link href="/employees">{t("employees")}</Link>
                    <ChevronRight className="size-4" />

                    {isLoading ? (
                        <Skeleton className="h-4 w-40" />
                    ) : (
                        <div className="flex items-center gap-1">
                            <User className="text-pink size-5" />
                            <div className="text-pink">{data?.email}</div>
                        </div>
                    )}
                </h1>
            </div>

            <div className="px-6">
                <div className="mb-4">
                    <UserHeader mode={currentMode} onModeChange={setCurrentMode} />
                </div>
                <div>
                    {currentMode === "profile" && <EmployeeProfile />}
                    {currentMode === "skills" && <div>Skills Component</div>}
                    {currentMode === "language" && <div>Language Component</div>}
                </div>
            </div>
        </div>
    );
}
