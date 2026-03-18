"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { ProfileLanguageTableSkeleton } from "@/components/shared/ProfileLanguageTableSkeleton";
import { RowActionsDropdown } from "@/components/shared/RowActionsDropdown";
import { Button } from "@/components/ui/button";
import { PROFICIENCY_COLOR } from "@/lib/constants/proficiency";
import { gqlClient } from "@/lib/graphql/fetcher";
import { LANGUAGES_QUERY } from "@/lib/graphql/operations/languages";
import { languagesListKey, type LanguageRow } from "@/lib/hooks/useLanguageTable";
import { useProfileLanguages, type ProfileLanguageRow } from "@/lib/hooks/useProfileLanguages";

import { AddProfileLanguageModal } from "./AddProfileLanguageModal";
import { RemoveProfileLanguageModal } from "./RemoveProfileLanguageModal";

interface ProfileLanguageTableProps {
    userId: string;
}

type LanguagesQueryResult = { languages: LanguageRow[] };

export function ProfileLanguageTable({ userId }: ProfileLanguageTableProps) {
    const tUser = useTranslations("User");
    const { languages, isLoading, isError } = useProfileLanguages(userId);

    const [addOpen, setAddOpen] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState<ProfileLanguageRow | null>(null);
    const [removeOpen, setRemoveOpen] = useState(false);
    const [removingLanguage, setRemovingLanguage] = useState<ProfileLanguageRow | null>(null);

    const { data: allLanguagesData, isLoading: isLoadingAll } = useQuery<LanguagesQueryResult>({
        queryKey: languagesListKey(),
        queryFn: () => gqlClient.request<LanguagesQueryResult>(LANGUAGES_QUERY),
    });

    const canAddMoreLanguages =
        isLoadingAll || (allLanguagesData && languages.length < allLanguagesData.languages.length);

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
                                        colSpan={3}
                                        className="text-body text-text-secondary px-6 py-16 text-center"
                                    >
                                        {tUser("no_languages")}
                                    </td>
                                </tr>
                            ) : (
                                languages.map((lang) => (
                                    <tr
                                        key={lang.name}
                                        className="border-divider hover:bg-hover-xs border-b transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span
                                                className={`text-small tracking-standard font-medium ${PROFICIENCY_COLOR[lang.proficiency]}`}
                                            >
                                                {lang.proficiency}
                                            </span>
                                        </td>

                                        <td className="text-small text-basic-text tracking-standard px-6 py-4">
                                            {lang.name}
                                        </td>

                                        <td className="w-18 py-4">
                                            <RowActionsDropdown
                                                ariaLabel={`${lang.name} actions`}
                                                onEdit={() => {
                                                    setEditingLanguage(lang);
                                                    setAddOpen(true);
                                                }}
                                                onDelete={() => {
                                                    setRemovingLanguage(lang);
                                                    setRemoveOpen(true);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Actions */}
            {canAddMoreLanguages && (
                <div className="flex h-14 items-center justify-end gap-4 px-6">
                    <Button
                        variant="redText"
                        onClick={() => {
                            setEditingLanguage(null);
                            setAddOpen(true);
                        }}
                    >
                        <Plus />
                        {tUser("add_language")}
                    </Button>
                </div>
            )}

            {/* Modals */}
            <AddProfileLanguageModal
                open={addOpen}
                userId={userId}
                existingLanguages={languages}
                editingLanguage={editingLanguage}
                onOpenChange={(v) => {
                    setAddOpen(v);
                    if (!v) setEditingLanguage(null);
                }}
            />
            <RemoveProfileLanguageModal
                open={removeOpen}
                userId={userId}
                language={removingLanguage}
                onOpenChange={(v) => {
                    setRemoveOpen(v);
                    if (!v) setRemovingLanguage(null);
                }}
            />
        </div>
    );
}
