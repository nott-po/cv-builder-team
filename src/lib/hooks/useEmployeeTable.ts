"use client";

import { useRouter } from "@/i18n/routing";
import { STALE_TIME_ENTITY } from "@/lib/constants/query";
import type { UserRole } from "@/lib/constants/roles";
import { gqlClient } from "@/lib/graphql/fetcher";
import { USERS_QUERY } from "@/lib/graphql/operations/employees";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useSortableTable } from "@/lib/hooks/useSortableTable";
import type { SortDir } from "@/types/table";

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

const getRows = (data: UsersQueryResult) => data.users;
const filterRow = (row: EmployeeRow, lower: string) =>
    [
        row.profile.first_name,
        row.profile.last_name,
        row.email,
        row.department_name,
        row.position_name,
    ].some((v) => v?.toLowerCase().includes(lower));
const sortRow = (a: EmployeeRow, b: EmployeeRow, dir: SortDir) => {
    const aDept = a.department_name ?? "";
    const bDept = b.department_name ?? "";
    return dir === "asc" ? aDept.localeCompare(bDept) : bDept.localeCompare(aDept);
};

export function useEmployeeTable(basePath = "/employees") {
    const router = useRouter();
    const { user } = useCurrentUser();

    const { state, paginatedRows, sortDir, handleSortToggle } = useSortableTable<
        UsersQueryResult,
        EmployeeRow
    >({
        basePath,
        queryKey: employeesListKey(),
        queryFn: () => gqlClient.request<UsersQueryResult>(USERS_QUERY),
        getRows,
        filterRow,
        sortRow,
        defaultSortDir: "desc",
        staleTime: STALE_TIME_ENTITY,
    });

    function handleRowClick(id: string) {
        if (user?.id === id) {
            router.push("/profile");
        } else router.push(`${basePath}/${id}`);
    }

    return {
        state,
        paginatedEmployees: paginatedRows,
        sortDir,
        handleSortToggle,
        handleRowClick,
    };
}
