"use client";

import { fetcher } from "@/lib/graphql/fetcher";
import { DEPARTMENTS_QUERY } from "@/lib/graphql/operations/departments";
import { useSimpleTable } from "@/lib/hooks/useSimpleTable";

export type DepartmentRow = {
    id: string;
    name: string;
};

export type DepartmentsQueryResult = {
    departments: DepartmentRow[];
};

export const departmentsListKey = () => ["departments", "list"] as const;

const getDepartmentRows = (data: DepartmentsQueryResult) => data.departments;
const filterDepartmentRow = (row: DepartmentRow, lower: string) =>
    row.name.toLowerCase().includes(lower);

export function useDepartmentTable(basePath = "/admin/departments") {
    const { state, paginatedRows } = useSimpleTable<DepartmentsQueryResult, DepartmentRow>({
        basePath,
        queryKey: departmentsListKey(),
        queryFn: () => fetcher<DepartmentsQueryResult, Record<string, never>>(DEPARTMENTS_QUERY)(),
        getRows: getDepartmentRows,
        filterRow: filterDepartmentRow,
    });

    return { state, paginatedDepartments: paginatedRows };
}
