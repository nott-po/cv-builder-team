"use client";

import type React from "react";

import { useTranslations } from "next-intl";

import { ChevronDown, ChevronUp } from "lucide-react";

import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { SkillTableSkeleton } from "@/components/shared/SkillTableSkeleton";
import { PAGE_SIZE_OPTIONS } from "@/lib/constants/table";
import { useSkillTable, type SkillRow } from "@/lib/hooks/useSkillTable";

type SkillTableProps = {
    actions?: React.ReactNode;
    renderRowActions?: (skill: SkillRow) => React.ReactNode;
};

export function SkillTable({ actions, renderRowActions }: SkillTableProps) {
    const tAdmin = useTranslations("Admin");
    const tUser = useTranslations("User");
    const {
        paginatedSkills,
        isLoading,
        isError,
        search,
        handleSearchChange,
        sortDir,
        handleSortToggle,
        page,
        pageSize,
        totalPages,
        handlePageChange,
        handlePageSizeChange,
    } = useSkillTable();

    if (isLoading) return <SkillTableSkeleton rows={pageSize} />;
    if (isError) return <ErrorMessage message={tAdmin("no_skills")} />;

    return (
        <div>
            {/* Toolbar */}
            <div className="flex h-14 items-center justify-between px-6">
                <SearchInput
                    value={search}
                    onChange={handleSearchChange}
                    placeholder={tAdmin("name")}
                />
                {actions}
            </div>

            {/* Table */}
            <div className="overflow-x-auto px-6">
                <table className="w-full min-w-[560px] border-collapse">
                    <thead>
                        <tr className="border-divider border-b">
                            <th className="py-4 text-left">
                                <span className="text-small text-basic-text tracking-standard px-6 font-medium whitespace-nowrap">
                                    {tAdmin("name")}
                                </span>
                            </th>

                            <th className="py-4 text-left">
                                <button
                                    onClick={handleSortToggle}
                                    className="text-small text-basic-text tracking-standard flex cursor-pointer items-center gap-1 px-6 font-medium transition-opacity hover:opacity-70"
                                >
                                    {tAdmin("type")}
                                    {sortDir === "asc" ? (
                                        <ChevronUp className="size-4.5" />
                                    ) : (
                                        <ChevronDown className="size-4.5" />
                                    )}
                                </button>
                            </th>

                            <th className="py-4 text-left">
                                <span className="text-small text-basic-text tracking-standard px-6 font-medium whitespace-nowrap">
                                    {tAdmin("category")}
                                </span>
                            </th>

                            <th className="w-18" />
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedSkills.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="text-body text-text-secondary py-16 text-center"
                                >
                                    {tAdmin("no_skills")}
                                </td>
                            </tr>
                        ) : (
                            paginatedSkills.map((skill) => (
                                <tr
                                    key={skill.id}
                                    className="border-divider border-b transition-colors"
                                >
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
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                rowsPerPageLabel={tUser("rows_per_page")}
                pageLabel={tUser("page_of", { page, total: totalPages })}
            />
        </div>
    );
}
