"use client";

import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { useTablePagination } from "@/lib/hooks/useTablePagination";
import type { SortDir, TableState } from "@/types/table";

interface SortableTableOptions<TData, TRow> {
    basePath: string;
    queryKey: readonly string[];
    queryFn: () => Promise<TData>;
    getRows: (data: TData) => TRow[];
    filterRow: (row: TRow, lower: string) => boolean;
    sortRow: (a: TRow, b: TRow, dir: SortDir) => number;
    defaultSortDir?: SortDir;
    staleTime?: number;
}

export function useSortableTable<TData, TRow>({
    basePath,
    queryKey,
    queryFn,
    getRows,
    filterRow,
    sortRow,
    defaultSortDir = "asc",
    staleTime,
}: SortableTableOptions<TData, TRow>) {
    const { page, setPage, pageSize, handlePageChange, handlePageSizeChange } =
        useTablePagination(basePath);

    const [search, setSearch] = useState("");
    const [sortDir, setSortDir] = useState<SortDir>(defaultSortDir);

    const { data, isLoading, isError } = useQuery<TData>({
        queryKey,
        queryFn,
        staleTime,
    });

    const rows = useMemo(() => {
        if (!data) return [] as TRow[];
        let result = getRows(data);

        if (search.trim()) {
            const lower = search.toLowerCase();
            result = result.filter((row) => filterRow(row, lower));
        }

        return [...result].sort((a, b) => sortRow(a, b, sortDir));
    }, [data, search, sortDir, getRows, filterRow, sortRow]);

    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    const paginatedRows = rows.slice((page - 1) * pageSize, page * pageSize);

    function handleSearchChange(value: string) {
        setSearch(value);
        setPage(1);
    }

    function handleSortToggle() {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
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

    return { state, paginatedRows, sortDir, handleSortToggle };
}
