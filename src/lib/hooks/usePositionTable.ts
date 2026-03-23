"use client";

import { STALE_TIME_REFERENCE } from "@/lib/constants/query";
import { gqlClient } from "@/lib/graphql/fetcher";
import {
    POSITIONS_QUERY,
    positionsListKey,
    type PositionRow,
    type PositionsQueryResult,
} from "@/lib/graphql/operations/positions";
import { useSimpleTable } from "@/lib/hooks/useSimpleTable";

export { positionsListKey, type PositionRow, type PositionsQueryResult };

const getPositionRows = (data: PositionsQueryResult) => data.positions;
const filterPositionRow = (row: PositionRow, lower: string) =>
    row.name.toLowerCase().includes(lower);

export function usePositionTable(basePath = "/admin/positions") {
    const { state, paginatedRows } = useSimpleTable<PositionsQueryResult, PositionRow>({
        basePath,
        queryKey: positionsListKey(),
        queryFn: () => gqlClient.request<PositionsQueryResult>(POSITIONS_QUERY),
        getRows: getPositionRows,
        filterRow: filterPositionRow,
        staleTime: STALE_TIME_REFERENCE,
    });

    return { state, paginatedPositions: paginatedRows };
}
