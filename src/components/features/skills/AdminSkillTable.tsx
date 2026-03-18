"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Plus } from "lucide-react";

import { RowActionsDropdown } from "@/components/shared/RowActionsDropdown";
import { SkillTable } from "@/components/shared/SkillTable";
import { Button } from "@/components/ui/button";
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
        <RowActionsDropdown
            ariaLabel="Skill actions"
            onEdit={() => {
                setEditSkill(skill);
                setEditOpen(true);
            }}
            onDelete={() => {
                setDeleteSkill(skill);
                setDeleteOpen(true);
            }}
        />
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
