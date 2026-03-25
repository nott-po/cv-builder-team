import { useQuery } from "@tanstack/react-query";

import { STALE_TIME_REFERENCE } from "@/lib/constants/query";
import { gqlClient } from "@/lib/graphql/fetcher";
import {
    DEPARTMENTS_QUERY,
    departmentsListKey,
    type DepartmentRow,
    type DepartmentsQueryResult,
} from "@/lib/graphql/operations/departments";

export function useDepartments() {
    return useQuery<DepartmentsQueryResult, Error, DepartmentRow[]>({
        queryKey: departmentsListKey(),
        queryFn: () => gqlClient.request<DepartmentsQueryResult>(DEPARTMENTS_QUERY),
        select: (data) => data.departments,
        staleTime: STALE_TIME_REFERENCE,
    });
}
