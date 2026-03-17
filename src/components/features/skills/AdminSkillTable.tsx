"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { EllipsisVertical, Pencil, Plus, Trash2 } from "lucide-react";

import { SkillTable } from "@/components/shared/SkillTable";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SkillRow } from "@/lib/hooks/useSkillTable";

import { CreateSkillModal } from "./CreateSkillModal";
import { DeleteSkillModal } from "./DeleteSkillModal";
import { EditSkillModal } from "./EditSkillModal";

export function AdminSkillTable() {
    const t = useTranslations("Admin");
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editSkill, setEditSkill] = useState<SkillRow | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteSkill, setDeleteSkill] = useState<SkillRow | null>(null);

    const renderRowActions = (skill: SkillRow) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="hover:bg-hover-md ml-4 flex size-10 items-center justify-center rounded-full transition-colors"
                    aria-label={t("skill_actions")}
                >
                    <EllipsisVertical className="text-text-hint size-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => {
                        setEditSkill(skill);
                        setEditOpen(true);
                    }}
                >
                    <Pencil />
                    {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                        setDeleteSkill(skill);
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
            <SkillTable
                renderRowActions={renderRowActions}
                actions={
                    <Button variant="redText" onClick={() => setCreateOpen(true)}>
                        <Plus />
                        {t("create_skill")}
                    </Button>
                }
            />
            <CreateSkillModal open={createOpen} onOpenChange={setCreateOpen} />
            <EditSkillModal open={editOpen} skill={editSkill} onOpenChange={setEditOpen} />
            <DeleteSkillModal open={deleteOpen} skill={deleteSkill} onOpenChange={setDeleteOpen} />
        </>
    );
}
