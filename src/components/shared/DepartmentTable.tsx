"use client";

import type React from "react";

import { useTranslations } from "next-intl";

import { DataTable } from "@/components/shared/DataTable";
import { DepartmentTableSkeleton } from "@/components/shared/DepartmentTableSkeleton";
import { useDepartmentTable, type DepartmentRow } from "@/lib/hooks/useDepartmentTable";

type DepartmentTableProps = {
    actions?: React.ReactNode;
    renderRowActions?: (department: DepartmentRow) => React.ReactNode;
};

export function DepartmentTable({ actions, renderRowActions }: DepartmentTableProps) {
    const t = useTranslations("Admin");
    const { state, paginatedDepartments } = useDepartmentTable();

    return (
        <DataTable
            state={state}
            messages={{ empty: t("no_departments"), error: t("error") }}
            searchPlaceholder={t("name")}
            actions={actions}
            skeleton={<DepartmentTableSkeleton rows={state.pageSize} />}
            colSpan={2}
            minWidth="320px"
            head={
                <>
                    <th className="py-4 text-left">
                        <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                            {t("name")}
                        </span>
                    </th>

                    <th className="w-18" />
                </>
            }
        >
            {paginatedDepartments.map((department) => (
                <tr key={department.id} className="border-divider border-b transition-colors">
                    <td className="text-small text-basic-text tracking-standard px-4 py-4">
                        {department.name}
                    </td>

                    <td className="w-18 py-4">{renderRowActions?.(department)}</td>
                </tr>
            ))}
        </DataTable>
    );
}
