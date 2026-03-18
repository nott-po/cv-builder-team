"use client";

import type React from "react";

import { useTranslations } from "next-intl";

import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";

import { DataTable } from "@/components/shared/DataTable";
import { EmployeeAvatar } from "@/components/shared/EmployeeAvatar";
import { EmployeeTableSkeleton } from "@/components/shared/EmployeeTableSkeleton";
import { useEmployeeTable, type EmployeeRow } from "@/lib/hooks/useEmployeeTable";

type EmployeeTableProps = {
    basePath?: string;
    actions?: React.ReactNode;
    renderRowActions?: (employee: EmployeeRow) => React.ReactNode;
};

export function EmployeeTable({ basePath, actions, renderRowActions }: EmployeeTableProps) {
    const t = useTranslations("User");
    const { state, paginatedEmployees, sortDir, handleSortToggle, handleRowClick } =
        useEmployeeTable(basePath);

    return (
        <DataTable
            state={state}
            messages={{ empty: t("no_employees"), error: t("error") }}
            searchPlaceholder={t("search")}
            actions={actions}
            skeleton={<EmployeeTableSkeleton rows={state.pageSize} />}
            colSpan={7}
            minWidth="640px"
            head={
                <>
                    <th className="w-20 py-4" />

                    <th className="py-4 text-left">
                        <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                            {t("first_name")}
                        </span>
                    </th>

                    <th className="py-4 text-left">
                        <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                            {t("last_name")}
                        </span>
                    </th>

                    <th className="py-4 text-left">
                        <span className="text-small text-basic-text tracking-standard px-4 font-medium">
                            {t("email")}
                        </span>
                    </th>

                    <th className="py-4 text-left">
                        <button
                            onClick={handleSortToggle}
                            className="text-small text-basic-text tracking-standard flex cursor-pointer items-center gap-1 px-4 font-medium transition-opacity hover:opacity-70"
                        >
                            {t("department")}
                            {sortDir === "asc" ? (
                                <ChevronUp className="size-4.5" />
                            ) : (
                                <ChevronDown className="size-4.5" />
                            )}
                        </button>
                    </th>

                    <th className="py-4 text-left">
                        <span className="text-small text-basic-text tracking-standard px-4 font-medium">
                            {t("position")}
                        </span>
                    </th>

                    <th className="w-18" />
                </>
            }
        >
            {paginatedEmployees.map((employee) => (
                <tr
                    key={employee.id}
                    className="border-divider hover:bg-hover-xs cursor-pointer border-b transition-colors"
                    onClick={() => handleRowClick(employee.id)}
                >
                    <td className="w-20 py-4 pl-4">
                        <EmployeeAvatar
                            avatar={employee.profile.avatar}
                            initial={(
                                employee.profile.first_name?.[0] ??
                                employee.email?.[0] ??
                                "?"
                            ).toUpperCase()}
                        />
                    </td>

                    <td className="text-small text-basic-text tracking-standard px-4 py-4">
                        {employee.profile.first_name ?? "—"}
                    </td>

                    <td className="text-small text-basic-text tracking-standard px-4 py-4">
                        {employee.profile.last_name ?? "—"}
                    </td>

                    <td className="text-small text-basic-text tracking-standard px-4 py-4">
                        {employee.email}
                    </td>

                    <td className="text-small text-basic-text tracking-standard px-4 py-4">
                        {employee.department_name ?? "—"}
                    </td>

                    <td className="text-small text-basic-text tracking-standard px-4 py-4">
                        {employee.position_name ?? "—"}
                    </td>

                    <td className="w-18 py-4">
                        {renderRowActions ? (
                            renderRowActions(employee)
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRowClick(employee.id);
                                }}
                                className="hover:bg-hover-md ml-4 flex size-10 items-center justify-center rounded-full transition-colors"
                                aria-label="View employee"
                            >
                                <ChevronRight className="text-text-hint size-6" />
                            </button>
                        )}
                    </td>
                </tr>
            ))}
        </DataTable>
    );
}
