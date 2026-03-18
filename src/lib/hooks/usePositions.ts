import { useQuery } from "@tanstack/react-query";

import { gqlClient } from "@/lib/graphql/fetcher";
import { POSITIONS_QUERY } from "@/lib/graphql/operations/positions";

export type PositionRow = {
    id: string;
    name: string;
};

export type PositionsQueryResult = {
    positions: PositionRow[];
};

export const positionsListKey = () => ["positions", "list"] as const;

export function usePositions() {
    return useQuery<PositionsQueryResult, Error, PositionRow[]>({
        queryKey: positionsListKey(),
        queryFn: () => gqlClient.request<PositionsQueryResult>(POSITIONS_QUERY),
        select: (data) => data.positions,
        staleTime: Infinity,
    });
}
