"use client";

import type React from "react";

import { useTranslations } from "next-intl";

import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { LanguageTableSkeleton } from "@/components/shared/LanguageTableSkeleton";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { PAGE_SIZE_OPTIONS } from "@/lib/constants/table";
import { useLanguageTable, type LanguageRow } from "@/lib/hooks/useLanguageTable";

type LanguageTableProps = {
    actions?: React.ReactNode;
    renderRowActions?: (language: LanguageRow) => React.ReactNode;
};

export function LanguageTable({ actions, renderRowActions }: LanguageTableProps) {
    const tAdmin = useTranslations("Admin");
    const tUser = useTranslations("User");
    const {
        paginatedLanguages,
        isLoading,
        isError,
        search,
        handleSearchChange,
        page,
        pageSize,
        totalPages,
        handlePageChange,
        handlePageSizeChange,
    } = useLanguageTable();

    if (isLoading) return <LanguageTableSkeleton rows={pageSize} />;
    if (isError) return <ErrorMessage message={tAdmin("no_languages")} />;

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
                <table className="w-full min-w-[480px] border-collapse">
                    <thead>
                        <tr className="border-divider border-b">
                            <th className="py-4 text-left">
                                <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                                    {tAdmin("iso2")}
                                </span>
                            </th>

                            <th className="py-4 text-left">
                                <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                                    {tAdmin("name")}
                                </span>
                            </th>

                            <th className="py-4 text-left">
                                <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                                    {tAdmin("native_name")}
                                </span>
                            </th>

                            <th className="w-18" />
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedLanguages.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="text-body text-text-secondary py-16 text-center"
                                >
                                    {tAdmin("no_languages")}
                                </td>
                            </tr>
                        ) : (
                            paginatedLanguages.map((language) => (
                                <tr
                                    key={language.id}
                                    className="border-divider border-b transition-colors"
                                >
                                    <td className="text-small text-basic-text tracking-standard px-4 py-4 font-mono uppercase">
                                        {language.iso2}
                                    </td>

                                    <td className="text-small text-basic-text tracking-standard px-4 py-4">
                                        {language.name}
                                    </td>

                                    <td className="text-small text-text-secondary tracking-standard px-4 py-4">
                                        {language.native_name ?? "—"}
                                    </td>

                                    <td className="w-18 py-4">{renderRowActions?.(language)}</td>
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
