"use client";

import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { useRouter } from "@/i18n/routing";
import { STALE_TIME_ENTITY } from "@/lib/constants/query";
import type { UserRole } from "@/lib/constants/roles";
import { fetcher } from "@/lib/graphql/fetcher";
import { USERS_QUERY } from "@/lib/graphql/operations/employees";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useTablePagination } from "@/lib/hooks/useTablePagination";
import type { SortDir, TableState } from "@/types/table";

export type EmployeeRow = {
    id: string;
    email: string;
    role: UserRole;
    department_name: string | null;
    department?: { id: string } | null;
    position_name: string | null;
    position?: { id: string } | null;
    profile: {
        first_name: string | null;
        last_name: string | null;
        avatar: string | null;
    };
};

type UsersQueryResult = {
    users: EmployeeRow[];
};

export const employeesListKey = () => ["employees", "list"] as const;

export function useEmployeeTable(basePath = "/employees") {
    const router = useRouter();
    const { page, setPage, pageSize, handlePageChange, handlePageSizeChange } =
        useTablePagination(basePath);
    const { user } = useCurrentUser();

    const [search, setSearch] = useState("");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    const { data, isLoading, isError } = useQuery<UsersQueryResult>({
        queryKey: employeesListKey(),
        queryFn: () => fetcher<UsersQueryResult, Record<string, never>>(USERS_QUERY)(),
        staleTime: STALE_TIME_ENTITY,
    });

    const employees = useMemo(() => {
        if (!data?.users) return [];

        let result = data.users;

        if (search.trim()) {
            const lower = search.toLowerCase();
            result = result.filter((u) =>
                [
                    u.profile.first_name,
                    u.profile.last_name,
                    u.email,
                    u.department_name,
                    u.position_name,
                ].some((v) => v?.toLowerCase().includes(lower)),
            );
        }

        return [...result].sort((a, b) => {
            const aDept = a.department_name ?? "";
            const bDept = b.department_name ?? "";
            return sortDir === "asc" ? aDept.localeCompare(bDept) : bDept.localeCompare(aDept);
        });
    }, [data, search, sortDir]);

    const totalPages = Math.max(1, Math.ceil(employees.length / pageSize));
    const paginatedEmployees = employees.slice((page - 1) * pageSize, page * pageSize);

    function handleSearchChange(value: string) {
        setSearch(value);
        setPage(1);
    }

    function handleSortToggle() {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        setPage(1);
    }

    function handleRowClick(id: string) {
        if (user?.id === id) {
            router.push("/profile");
        } else router.push(`${basePath}/${id}`);
    }

    const state: TableState = {
        isLoading,
        isError,
        isEmpty: employees.length === 0,
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
        paginatedEmployees,
        sortDir,
        handleSortToggle,
        handleRowClick,
    };
}
