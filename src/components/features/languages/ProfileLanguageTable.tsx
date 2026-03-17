"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Plus, Trash2 } from "lucide-react";

import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { ProfileLanguageTableSkeleton } from "@/components/shared/ProfileLanguageTableSkeleton";
import { Button } from "@/components/ui/button";
import { Proficiency } from "@/generated/graphql";
import { useProfileLanguages, type ProfileLanguageRow } from "@/lib/hooks/useProfileLanguages";

import { AddProfileLanguageModal } from "./AddProfileLanguageModal";
import { RemoveProfileLanguageModal } from "./RemoveProfileLanguageModal";

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

export function ProfileLanguageTable({ userId }: ProfileLanguageTableProps) {
    const tUser = useTranslations("User");
    const { languages, isLoading, isError } = useProfileLanguages(userId);

    const [addOpen, setAddOpen] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState<ProfileLanguageRow | null>(null);
    const [removeOpen, setRemoveOpen] = useState(false);
    const [removingLanguage, setRemovingLanguage] = useState<ProfileLanguageRow | null>(null);

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
                                        className="border-divider hover:bg-hover-xs cursor-pointer border-b transition-colors"
                                        onClick={() => {
                                            setEditingLanguage(lang);
                                            setAddOpen(true);
                                        }}
                                    >
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

                                        <td className="w-18 py-4">
                                            <button
                                                className="hover:bg-hover-md ml-4 flex size-10 items-center justify-center rounded-full transition-colors"
                                                aria-label={`Remove ${lang.name}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setRemovingLanguage(lang);
                                                    setRemoveOpen(true);
                                                }}
                                            >
                                                <Trash2 className="text-destructive size-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Actions */}
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
