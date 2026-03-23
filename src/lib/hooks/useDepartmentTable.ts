"use client";

import { STALE_TIME_REFERENCE } from "@/lib/constants/query";
import { gqlClient } from "@/lib/graphql/fetcher";
import {
    DEPARTMENTS_QUERY,
    departmentsListKey,
    type DepartmentRow,
    type DepartmentsQueryResult,
} from "@/lib/graphql/operations/departments";
import { useSimpleTable } from "@/lib/hooks/useSimpleTable";

export { departmentsListKey, type DepartmentRow, type DepartmentsQueryResult };

const getDepartmentRows = (data: DepartmentsQueryResult) => data.departments;
const filterDepartmentRow = (row: DepartmentRow, lower: string) =>
    row.name.toLowerCase().includes(lower);

export function useDepartmentTable(basePath = "/admin/departments") {
    const { state, paginatedRows } = useSimpleTable<DepartmentsQueryResult, DepartmentRow>({
        basePath,
        queryKey: departmentsListKey(),
        queryFn: () => gqlClient.request<DepartmentsQueryResult>(DEPARTMENTS_QUERY),
        getRows: getDepartmentRows,
        filterRow: filterDepartmentRow,
        staleTime: STALE_TIME_REFERENCE,
    });

    return { state, paginatedDepartments: paginatedRows };
}
