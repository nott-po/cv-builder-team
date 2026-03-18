"use client";

import { useTranslations } from "next-intl";

import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { ProfileLanguageTableSkeleton } from "@/components/shared/ProfileLanguageTableSkeleton";
import { Proficiency } from "@/generated/graphql";
import { useProfileLanguages } from "@/lib/hooks/useProfileLanguages";

const PROFICIENCY_COLORS: Record<Proficiency, string> = {
    [Proficiency.A1]: "text-text-secondary",
    [Proficiency.A2]: "text-text-secondary",
    [Proficiency.B1]: "text-green-600 dark:text-green-400",
    [Proficiency.B2]: "text-green-600 dark:text-green-400",
    [Proficiency.C1]: "text-blue-600 dark:text-blue-400",
    [Proficiency.C2]: "text-blue-600 dark:text-blue-400",
    [Proficiency.Native]: "text-destructive",
};

interface ProfileLanguageTableProps {
    userId: string;
}

export function ProfileLanguagesPage({ userId }: ProfileLanguageTableProps) {
    const tUser = useTranslations("User");
    const { languages, isLoading, isError } = useProfileLanguages(userId);

    if (isError) return <ErrorMessage message={tUser("error")} />;

    return (
        <div>
            {/* Table */}
            {isLoading ? (
                <ProfileLanguageTableSkeleton />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[320px] border-collapse">
                        <tbody>
                            {languages.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="text-body text-text-secondary px-6 py-16 text-center"
                                    >
                                        {tUser("no_languages")}
                                    </td>
                                </tr>
                            ) : (
                                languages.map((lang) => (
                                    <tr key={lang.name} className="border-divider border-b">
                                        <td className="px-6 py-4">
                                            <span
                                                className={`text-small tracking-standard font-medium ${PROFICIENCY_COLORS[lang.proficiency]}`}
                                            >
                                                {lang.proficiency}
                                            </span>
                                        </td>

                                        <td className="text-small text-basic-text tracking-standard px-6 py-4">
                                            {lang.name}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
