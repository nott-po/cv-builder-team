"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { ChevronDown, ChevronUp, Plus } from "lucide-react";

import { DataTable } from "@/components/shared/DataTable";
import { RowActionsDropdown } from "@/components/shared/RowActionsDropdown";
import { SkillTableSkeleton } from "@/components/shared/SkillTableSkeleton";
import { Button } from "@/components/ui/button";
import { useSkillTable, type SkillRow } from "@/lib/hooks/useSkillTable";

import { CreateSkillModal } from "./CreateSkillModal";
import { DeleteSkillModal } from "./DeleteSkillModal";
import { EditSkillModal } from "./EditSkillModal";

export function AdminSkillTable() {
    const t = useTranslations("Admin");
    const { state, paginatedSkills, sortDir, handleSortToggle } = useSkillTable();
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editSkill, setEditSkill] = useState<SkillRow | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteSkill, setDeleteSkill] = useState<SkillRow | null>(null);

    return (
        <>
            <DataTable
                state={state}
                messages={{ empty: t("no_skills"), error: t("error") }}
                searchPlaceholder={t("name")}
                actions={
                    <Button variant="redText" onClick={() => setCreateOpen(true)}>
                        <Plus />
                        {t("create_skill")}
                    </Button>
                }
                skeleton={<SkillTableSkeleton rows={state.pageSize} />}
                colSpan={4}
                minWidth="560px"
                head={
                    <>
                        <th className="py-4 text-left">
                            <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                                {t("name")}
                            </span>
                        </th>

                        <th className="py-4 text-left">
                            <button
                                onClick={handleSortToggle}
                                className="text-small text-basic-text tracking-standard flex cursor-pointer items-center gap-1 px-4 font-medium transition-opacity hover:opacity-70"
                            >
                                {t("type")}
                                {sortDir === "asc" ? (
                                    <ChevronUp className="size-4.5" />
                                ) : (
                                    <ChevronDown className="size-4.5" />
                                )}
                            </button>
                        </th>

                        <th className="py-4 text-left">
                            <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                                {t("category")}
                            </span>
                        </th>

                        <th className="w-18" />
                    </>
                }
            >
                {paginatedSkills.map((skill) => (
                    <tr key={skill.id} className="border-divider border-b transition-colors">
                        <td className="text-small text-basic-text tracking-standard px-4 py-4">
                            {skill.name}
                        </td>

                        <td className="text-small text-basic-text tracking-standard px-4 py-4">
                            {skill.category_parent_name ?? "—"}
                        </td>

                        <td className="text-small text-text-secondary tracking-standard px-4 py-4">
                            {skill.category_name ?? "—"}
                        </td>

                        <td className="w-18 py-4">
                            <RowActionsDropdown
                                ariaLabel={t("skill_actions")}
                                onEdit={() => {
                                    setEditSkill(skill);
                                    setEditOpen(true);
                                }}
                                onDelete={() => {
                                    setDeleteSkill(skill);
                                    setDeleteOpen(true);
                                }}
                            />
                        </td>
                    </tr>
                ))}
            </DataTable>

            <CreateSkillModal open={createOpen} onOpenChange={setCreateOpen} />
            <EditSkillModal open={editOpen} skill={editSkill} onOpenChange={setEditOpen} />
            <DeleteSkillModal open={deleteOpen} skill={deleteSkill} onOpenChange={setDeleteOpen} />
        </>
    );
}
