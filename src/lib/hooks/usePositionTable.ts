"use client";

import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { fetcher } from "@/lib/graphql/fetcher";
import { POSITIONS_QUERY } from "@/lib/graphql/operations/positions";
import { useTablePagination } from "@/lib/hooks/useTablePagination";
import type { TableState } from "@/types/table";

export type PositionRow = {
    id: string;
    name: string;
};

type PositionsQueryResult = {
    positions: PositionRow[];
};

export const positionsListKey = () => ["positions", "list"] as const;

export function usePositionTable(basePath = "/admin/positions") {
    const { page, setPage, pageSize, handlePageChange, handlePageSizeChange } =
        useTablePagination(basePath);

    const [search, setSearch] = useState("");

    const { data, isLoading, isError } = useQuery<PositionsQueryResult>({
        queryKey: positionsListKey(),
        queryFn: () => fetcher<PositionsQueryResult, Record<string, never>>(POSITIONS_QUERY)(),
    });

    const positions = useMemo(() => {
        if (!data?.positions) return [];

        if (!search.trim()) return data.positions;

        const lower = search.toLowerCase();
        return data.positions.filter((p) => p.name.toLowerCase().includes(lower));
    }, [data, search]);

    const totalPages = Math.max(1, Math.ceil(positions.length / pageSize));
    const paginatedPositions = positions.slice((page - 1) * pageSize, page * pageSize);

    function handleSearchChange(value: string) {
        setSearch(value);
        setPage(1);
    }

    const state: TableState = {
        isLoading,
        isError,
        isEmpty: positions.length === 0,
        search,
        onSearchChange: handleSearchChange,
        page,
        pageSize,
        totalPages,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,
    };

    return {
        state,
        paginatedPositions,
    };
}
