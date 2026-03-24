import { useQuery } from "@tanstack/react-query";

import { gqlClient } from "@/lib/graphql/fetcher";
import { DEPARTMENTS_QUERY } from "@/lib/graphql/operations/departments";

export type DepartmentRow = {
    id: string;
    name: string;
};

export type DepartmentsQueryResult = {
    departments: DepartmentRow[];
};

export const departmentsListKey = () => ["departments", "list"] as const;

export function useDepartments() {
    return useQuery<DepartmentsQueryResult, Error, DepartmentRow[]>({
        queryKey: departmentsListKey(),
        queryFn: () => gqlClient.request<DepartmentsQueryResult>(DEPARTMENTS_QUERY),
        select: (data) => data.departments,
    });
}
