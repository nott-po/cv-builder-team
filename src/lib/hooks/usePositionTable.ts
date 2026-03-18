"use client";

import { fetcher } from "@/lib/graphql/fetcher";
import { POSITIONS_QUERY } from "@/lib/graphql/operations/positions";
import { useSimpleTable } from "@/lib/hooks/useSimpleTable";

export type PositionRow = {
    id: string;
    name: string;
};

export type PositionsQueryResult = {
    positions: PositionRow[];
};

export const positionsListKey = () => ["positions", "list"] as const;

const getPositionRows = (data: PositionsQueryResult) => data.positions;
const filterPositionRow = (row: PositionRow, lower: string) =>
    row.name.toLowerCase().includes(lower);

export function usePositionTable(basePath = "/admin/positions") {
    const { state, paginatedRows } = useSimpleTable<PositionsQueryResult, PositionRow>({
        basePath,
        queryKey: positionsListKey(),
        queryFn: () => fetcher<PositionsQueryResult, Record<string, never>>(POSITIONS_QUERY)(),
        getRows: getPositionRows,
        filterRow: filterPositionRow,
    });

    return { state, paginatedPositions: paginatedRows };
}
