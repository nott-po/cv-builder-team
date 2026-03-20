"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Plus } from "lucide-react";

import { AdminDeleteModal } from "@/components/shared/AdminDeleteModal";
import { DataTable } from "@/components/shared/DataTable";
import { RowActionsDropdown } from "@/components/shared/RowActionsDropdown";
import { Button } from "@/components/ui/button";
import { DELETE_LANGUAGE_MUTATION } from "@/lib/graphql/operations/languages";
import { languagesListKey, useLanguageTable, type LanguageRow } from "@/lib/hooks/useLanguageTable";

import { CreateLanguageModal } from "./CreateLanguageModal";
import { EditLanguageModal } from "./EditLanguageModal";
import { LanguageTableSkeleton } from "./LanguageTableSkeleton";

export function AdminLanguageTable() {
    const t = useTranslations("Admin");
    const { state, paginatedLanguages } = useLanguageTable();
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editLanguage, setEditLanguage] = useState<LanguageRow | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteLanguage, setDeleteLanguage] = useState<LanguageRow | null>(null);

    return (
        <>
            <DataTable
                state={state}
                messages={{ empty: t("no_languages"), error: t("error") }}
                searchPlaceholder={t("name")}
                actions={
                    <Button variant="redText" onClick={() => setCreateOpen(true)}>
                        <Plus />
                        {t("create_language")}
                    </Button>
                }
                skeleton={<LanguageTableSkeleton rows={state.pageSize} />}
                colSpan={4}
                minWidth="480px"
                head={
                    <>
                        <th className="py-4 text-left">
                            <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                                {t("iso2")}
                            </span>
                        </th>

                        <th className="py-4 text-left">
                            <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                                {t("name")}
                            </span>
                        </th>

                        <th className="py-4 text-left">
                            <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                                {t("native_name")}
                            </span>
                        </th>

                        <th className="w-18" />
                    </>
                }
            >
                {paginatedLanguages.map((language) => (
                    <tr key={language.id} className="border-divider border-b transition-colors">
                        <td className="text-small text-basic-text tracking-standard px-4 py-4 font-mono uppercase">
                            {language.iso2}
                        </td>

                        <td className="text-small text-basic-text tracking-standard px-4 py-4">
                            {language.name}
                        </td>

                        <td className="text-small text-text-secondary tracking-standard px-4 py-4">
                            {language.native_name ?? "—"}
                        </td>

                        <td className="w-18 py-4">
                            <RowActionsDropdown
                                ariaLabel={t("language_actions")}
                                onEdit={() => {
                                    setEditLanguage(language);
                                    setEditOpen(true);
                                }}
                                onDelete={() => {
                                    setDeleteLanguage(language);
                                    setDeleteOpen(true);
                                }}
                            />
                        </td>
                    </tr>
                ))}
            </DataTable>

            <CreateLanguageModal open={createOpen} onOpenChange={setCreateOpen} />
            <EditLanguageModal open={editOpen} language={editLanguage} onOpenChange={setEditOpen} />
            <AdminDeleteModal
                open={deleteOpen}
                item={deleteLanguage}
                onOpenChange={setDeleteOpen}
                mutation={DELETE_LANGUAGE_MUTATION}
                buildVars={(id) => ({ language: { languageId: id } })}
                queryKey={languagesListKey()}
                titleKey="delete_language_title"
                confirmKey="delete_language_confirm"
                errorKey="delete_language_error"
            />
        </>
    );
}
