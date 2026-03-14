"use client";

import { useMemo, useState } from "react";

import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import type { UserRole } from "@/generated/graphql";
import { useRouter } from "@/i18n/routing";
import { fetcher } from "@/lib/graphql/fetcher";
import { USERS_QUERY } from "@/lib/graphql/operations/employees";

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

type SortDir = "asc" | "desc";

export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const;
export const DEFAULT_PAGE_SIZE = 10;

export function useEmployeeTable(basePath = "/employees") {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState("");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [page, setPage] = useState(1);
    const pageSize = Number(searchParams.get("pageSize")) || 10;

    const { data, isLoading, isError } = useQuery<UsersQueryResult>({
        queryKey: ["employees", "list"],
        queryFn: () => fetcher<UsersQueryResult, Record<string, never>>(USERS_QUERY)(),
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

    function handlePageSizeChange(size: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("pageSize", String(size));
        router.push(`${basePath}?${params.toString()}`);
        setPage(1);
    }

    function handleRowClick(id: string) {
        router.push(`${basePath}/${id}`);
    }

    return {
        paginatedEmployees,
        isLoading,
        isError,
        search,
        handleSearchChange,
        sortDir,
        handleSortToggle,
        page,
        pageSize,
        totalPages,
        setPage,
        handlePageSizeChange,
        handleRowClick,
    };
}
