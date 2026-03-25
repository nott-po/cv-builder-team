"use client";

import type React from "react";

import { useTranslations } from "next-intl";

import { ChevronRight } from "lucide-react";

import { DataTable } from "@/components/shared/DataTable";
import { EmployeeAvatar } from "@/components/shared/EmployeeAvatar";
import { SortableColumnHeader } from "@/components/shared/SortableColumnHeader";
import { useEmployeeTable, type EmployeeRow } from "@/lib/hooks/useEmployeeTable";

import { EmployeeTableSkeleton } from "./EmployeeTableSkeleton";

const thClass = "text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap";
const tdClass = "text-small text-basic-text tracking-standard px-4 py-4";

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
                        <span className={thClass}>{t("first_name")}</span>
                    </th>

                    <th className="py-4 text-left">
                        <span className={thClass}>{t("last_name")}</span>
                    </th>

                    <th className="py-4 text-left">
                        <span className={thClass}>{t("email")}</span>
                    </th>

                    <SortableColumnHeader
                        label={t("department")}
                        sortDir={sortDir}
                        onToggle={handleSortToggle}
                    />

                    <th className="py-4 text-left">
                        <span className={thClass}>{t("position")}</span>
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

                    <td className={tdClass}>{employee.profile.first_name ?? "—"}</td>

                    <td className={tdClass}>{employee.profile.last_name ?? "—"}</td>

                    <td className={tdClass}>{employee.email}</td>

                    <td className={tdClass}>{employee.department_name ?? "—"}</td>

                    <td className={tdClass}>{employee.position_name ?? "—"}</td>

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
                                aria-label={t("view_employee")}
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
