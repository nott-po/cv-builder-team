"use client";

import type React from "react";

import { useTranslations } from "next-intl";

import { ChevronDown, ChevronUp } from "lucide-react";

import { DataTable } from "@/components/shared/DataTable";
import { SkillTableSkeleton } from "@/components/shared/SkillTableSkeleton";
import { useSkillTable, type SkillRow } from "@/lib/hooks/useSkillTable";

type SkillTableProps = {
    actions?: React.ReactNode;
    renderRowActions?: (skill: SkillRow) => React.ReactNode;
};

export function SkillTable({ actions, renderRowActions }: SkillTableProps) {
    const t = useTranslations("Admin");
    const { state, paginatedSkills, sortDir, handleSortToggle } = useSkillTable();

    return (
        <DataTable
            state={state}
            messages={{ empty: t("no_skills"), error: t("error") }}
            searchPlaceholder={t("name")}
            actions={actions}
            skeleton={<SkillTableSkeleton rows={state.pageSize} />}
            colSpan={4}
            minWidth="560px"
            head={
                <>
                    <th className="py-4 text-left">
                        <span className="text-small text-basic-text tracking-standard px-6 font-medium whitespace-nowrap">
                            {t("name")}
                        </span>
                    </th>

                    <th className="py-4 text-left">
                        <button
                            onClick={handleSortToggle}
                            className="text-small text-basic-text tracking-standard flex cursor-pointer items-center gap-1 px-6 font-medium transition-opacity hover:opacity-70"
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
                        <span className="text-small text-basic-text tracking-standard px-6 font-medium whitespace-nowrap">
                            {t("category")}
                        </span>
                    </th>

                    <th className="w-18" />
                </>
            }
        >
            {paginatedSkills.map((skill) => (
                <tr key={skill.id} className="border-divider border-b transition-colors">
                    <td className="text-small text-basic-text tracking-standard px-6 py-4">
                        {skill.name}
                    </td>

                    <td className="text-small text-basic-text tracking-standard px-6 py-4">
                        {skill.category_parent_name ?? "—"}
                    </td>

                    <td className="text-small text-text-secondary tracking-standard px-6 py-4">
                        {skill.category_name ?? "—"}
                    </td>

                    <td className="w-18 py-4">{renderRowActions?.(skill)}</td>
                </tr>
            ))}
        </DataTable>
    );
}
