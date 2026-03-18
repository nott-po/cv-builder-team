"use client";

import type React from "react";

import { useTranslations } from "next-intl";

import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { PAGE_SIZE_OPTIONS } from "@/lib/constants/table";
import type { TableState } from "@/types/table";

type DataTableProps = {
    state: TableState;
    messages: {
        empty: string;
        error: string;
    };
    searchPlaceholder: string;
    skeleton: React.ReactNode;
    head: React.ReactNode;
    children: React.ReactNode;
    colSpan: number;
    actions?: React.ReactNode;
    minWidth?: string;
};

export function DataTable({
    state,
    messages,
    searchPlaceholder,
    skeleton,
    head,
    children,
    colSpan,
    actions,
    minWidth,
}: DataTableProps) {
    const t = useTranslations("Common");

    if (state.isLoading) return <>{skeleton}</>;
    if (state.isError) return <ErrorMessage message={messages.error} />;

    return (
        <div>
            {/* Toolbar */}
            <div className="flex h-14 items-center justify-between px-6">
                <SearchInput
                    value={state.search}
                    onChange={state.onSearchChange}
                    placeholder={searchPlaceholder}
                />
                {actions}
            </div>

            {/* Table */}
            <div className="overflow-x-auto px-6">
                <table
                    className="w-full border-collapse"
                    style={minWidth ? { minWidth } : undefined}
                >
                    <thead>
                        <tr className="border-divider border-b">{head}</tr>
                    </thead>
                    <tbody>
                        {state.isEmpty ? (
                            <tr>
                                <td
                                    colSpan={colSpan}
                                    className="text-body text-text-secondary py-16 text-center"
                                >
                                    {messages.empty}
                                </td>
                            </tr>
                        ) : (
                            children
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                page={state.page}
                totalPages={state.totalPages}
                pageSize={state.pageSize}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                onPageChange={state.onPageChange}
                onPageSizeChange={state.onPageSizeChange}
                rowsPerPageLabel={t("rows_per_page")}
                pageLabel={t("page_of", { page: state.page, total: state.totalPages })}
            />
        </div>
    );
}
