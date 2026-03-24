import { useQuery } from "@tanstack/react-query";

import { STALE_TIME_REFERENCE } from "@/lib/constants/query";
import { gqlClient } from "@/lib/graphql/fetcher";
import {
    POSITIONS_QUERY,
    positionsListKey,
    type PositionRow,
    type PositionsQueryResult,
} from "@/lib/graphql/operations/positions";

export function usePositions() {
    return useQuery<PositionsQueryResult, Error, PositionRow[]>({
        queryKey: positionsListKey(),
        queryFn: () => gqlClient.request<PositionsQueryResult>(POSITIONS_QUERY),
        select: (data) => data.positions,
        staleTime: STALE_TIME_REFERENCE,
    });
}
