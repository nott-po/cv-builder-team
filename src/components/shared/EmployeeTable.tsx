"use client";

import type React from "react";

import { useTranslations } from "next-intl";

import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";

import { EmployeeAvatar } from "@/components/shared/EmployeeAvatar";
import { EmployeeTableSkeleton } from "@/components/shared/EmployeeTableSkeleton";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import {
    PAGE_SIZE_OPTIONS,
    useEmployeeTable,
    type EmployeeRow,
} from "@/lib/hooks/useEmployeeTable";

type EmployeeTableProps = {
    basePath?: string;
    actions?: React.ReactNode;
    renderRowActions?: (employee: EmployeeRow) => React.ReactNode;
};

export function EmployeeTable({ basePath, actions, renderRowActions }: EmployeeTableProps) {
    const t = useTranslations("User");
    const {
        paginatedEmployees,
        isLoading,
        isError,
        search,
        handleSearchChange,
        sortDir,
        handleSortToggle,
        page,
        pageSize,
        totalPages,
        setPage,
        handlePageSizeChange,
        handleRowClick,
    } = useEmployeeTable(basePath);

    if (isLoading) return <EmployeeTableSkeleton rows={pageSize} />;
    if (isError) return <ErrorMessage message={t("error")} />;

    return (
        <div>
            {/* Search */}
            <div className="flex h-14 items-center justify-between px-6">
                <SearchInput
                    value={search}
                    onChange={handleSearchChange}
                    placeholder={t("search")}
                />
                {actions}
            </div>

            {/* Table */}
            <div className="px-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-divider border-b">
                            <th className="w-20 py-4" />

                            <th className="py-4 text-left">
                                <span className="text-small text-basic-text tracking-standard px-4 font-medium">
                                    {t("first_name")}
                                </span>
                            </th>

                            <th className="py-4 text-left">
                                <span className="text-small text-basic-text tracking-standard px-4 font-medium">
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
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedEmployees.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="text-body text-text-secondary py-16 text-center"
                                >
                                    {t("no_employees")}
                                </td>
                            </tr>
                        ) : (
                            paginatedEmployees.map((employee) => (
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                onPageChange={setPage}
                onPageSizeChange={handlePageSizeChange}
                rowsPerPageLabel={t("rows_per_page")}
                pageLabel={t("page_of", { page, total: totalPages })}
            />
        </div>
    );
}
