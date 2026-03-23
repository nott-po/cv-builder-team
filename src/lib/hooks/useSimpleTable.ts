"use client";

import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { useTablePagination } from "@/lib/hooks/useTablePagination";
import type { TableState } from "@/types/table";

interface SimpleTableOptions<TData, TRow> {
    basePath: string;
    queryKey: readonly string[];
    queryFn: () => Promise<TData>;
    getRows: (data: TData) => TRow[];
    filterRow: (row: TRow, lower: string) => boolean;
    staleTime?: number;
}

export function useSimpleTable<TData, TRow>({
    basePath,
    queryKey,
    queryFn,
    getRows,
    filterRow,
    staleTime,
}: SimpleTableOptions<TData, TRow>) {
    const { page, setPage, pageSize, handlePageChange, handlePageSizeChange } =
        useTablePagination(basePath);

    const [search, setSearch] = useState("");

    const { data, isLoading, isError } = useQuery<TData>({
        queryKey,
        queryFn,
        staleTime,
    });

    const rows = useMemo(() => {
        if (!data) return [] as TRow[];
        const all = getRows(data);
        if (!search.trim()) return all;
        const lower = search.toLowerCase();
        return all.filter((row) => filterRow(row, lower));
    }, [data, search, getRows, filterRow]);

    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    const paginatedRows = rows.slice((page - 1) * pageSize, page * pageSize);

    function handleSearchChange(value: string) {
        setSearch(value);
        setPage(1);
    }

    const state: TableState = {
        isLoading,
        isError,
        isEmpty: rows.length === 0,
        search,
        onSearchChange: handleSearchChange,
        page,
        pageSize,
        totalPages,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,
    };

    return { state, paginatedRows };
}
