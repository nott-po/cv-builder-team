"use client";

import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { fetcher } from "@/lib/graphql/fetcher";
import { DEPARTMENTS_QUERY } from "@/lib/graphql/operations/departments";
import { useTablePagination } from "@/lib/hooks/useTablePagination";
import type { TableState } from "@/types/table";

export type DepartmentRow = {
    id: string;
    name: string;
};

type DepartmentsQueryResult = {
    departments: DepartmentRow[];
};

export const departmentsListKey = () => ["departments", "list"] as const;

export function useDepartmentTable(basePath = "/admin/departments") {
    const { page, setPage, pageSize, handlePageChange, handlePageSizeChange } =
        useTablePagination(basePath);

    const [search, setSearch] = useState("");

    const { data, isLoading, isError } = useQuery<DepartmentsQueryResult>({
        queryKey: departmentsListKey(),
        queryFn: () => fetcher<DepartmentsQueryResult, Record<string, never>>(DEPARTMENTS_QUERY)(),
    });

    const departments = useMemo(() => {
        if (!data?.departments) return [];

        if (!search.trim()) return data.departments;

        const lower = search.toLowerCase();
        return data.departments.filter((d) => d.name.toLowerCase().includes(lower));
    }, [data, search]);

    const totalPages = Math.max(1, Math.ceil(departments.length / pageSize));
    const paginatedDepartments = departments.slice((page - 1) * pageSize, page * pageSize);

    function handleSearchChange(value: string) {
        setSearch(value);
        setPage(1);
    }

    const state: TableState = {
        isLoading,
        isError,
        isEmpty: departments.length === 0,
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
        paginatedDepartments,
    };
}
