"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { EllipsisVertical, Pencil, Plus, Trash2 } from "lucide-react";

import { LanguageTable } from "@/components/shared/LanguageTable";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="hover:bg-hover-md ml-4 flex size-10 items-center justify-center rounded-full transition-colors"
                    aria-label={t("language_actions")}
                >
                    <EllipsisVertical className="text-text-hint size-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => {
                        setEditLanguage(language);
                        setEditOpen(true);
                    }}
                >
                    <Pencil />
                    {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                        setDeleteLanguage(language);
                        setDeleteOpen(true);
                    }}
                >
                    <Trash2 />
                    {t("delete")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
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
