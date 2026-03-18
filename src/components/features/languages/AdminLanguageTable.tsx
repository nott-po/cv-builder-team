"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Plus } from "lucide-react";

import { LanguageTable } from "@/components/shared/LanguageTable";
import { RowActionsDropdown } from "@/components/shared/RowActionsDropdown";
import { Button } from "@/components/ui/button";
import type { LanguageRow } from "@/lib/hooks/useLanguageTable";

import { CreateLanguageModal } from "./CreateLanguageModal";
import { DeleteLanguageModal } from "./DeleteLanguageModal";
import { EditLanguageModal } from "./EditLanguageModal";

export function AdminLanguageTable() {
    const t = useTranslations("Admin");
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editLanguage, setEditLanguage] = useState<LanguageRow | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteLanguage, setDeleteLanguage] = useState<LanguageRow | null>(null);

    const renderRowActions = (language: LanguageRow) => (
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
    );

    return (
        <>
            <LanguageTable
                renderRowActions={renderRowActions}
                actions={
                    <Button variant="redText" onClick={() => setCreateOpen(true)}>
                        <Plus />
                        {t("create_language")}
                    </Button>
                }
            />
            <CreateLanguageModal open={createOpen} onOpenChange={setCreateOpen} />
            <EditLanguageModal open={editOpen} language={editLanguage} onOpenChange={setEditOpen} />
            <DeleteLanguageModal
                open={deleteOpen}
                language={deleteLanguage}
                onOpenChange={setDeleteOpen}
            />
        </>
    );
}
