"use client";

import { useMemo, useState } from "react";

import { useTranslations } from "next-intl";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";

import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { useRouter } from "@/i18n/routing";
import { fetcher } from "@/lib/graphql/fetcher";
import { USERS_QUERY } from "@/lib/graphql/operations/employees";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const;

type EmployeeRow = {
    id: string;
    email: string;
    department_name: string | null;
    position_name: string | null;
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

function EmployeeAvatar({
    avatar,
    firstName,
    email,
}: {
    avatar?: string | null;
    firstName?: string | null;
    email: string;
}) {
    const initial = (firstName?.[0] ?? email?.[0] ?? "?").toUpperCase();

    if (avatar) {
        return (
            <Image
                src={avatar}
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
            />
        );
    }

    return (
        <div className="bg-avatar-default flex size-10 shrink-0 items-center justify-center rounded-full">
            <span className="text-title text-surface leading-none font-normal uppercase">
                {initial}
            </span>
        </div>
    );
}

export function EmployeeTable() {
    const t = useTranslations("User");
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<number>(10);

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

    if (isLoading) return <LoadingSpinner message={t("loading")} />;
    if (isError) return <ErrorMessage message={t("error")} />;

    return (
        <div>
            {/* Search */}
            <div className="flex h-14 items-center px-6">
                <SearchInput
                    value={search}
                    onChange={(v) => {
                        setSearch(v);
                        setPage(1);
                    }}
                    placeholder={t("search")}
                />
            </div>

            {/* Table */}
            <div className="px-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-divider border-b">
                            <th className="w-20 py-4" />

                            <th className="py-4 text-left">
                                <span className="text-small text-basic-text tracking-standard px-4 font-medium">
                                    {t("first_name")}
                                </span>
                            </th>

                            <th className="py-4 text-left">
                                <span className="text-small text-basic-text tracking-standard px-4 font-medium">
                                    {t("last_name")}
                                </span>
                            </th>

                            <th className="py-4 text-left">
                                <span className="text-small text-basic-text tracking-standard px-4 font-medium">
                                    {t("email")}
                                </span>
                            </th>

                            <th className="py-4 text-left">
                                <button
                                    onClick={() => {
                                        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                                        setPage(1);
                                    }}
                                    className="text-small text-basic-text tracking-standard flex cursor-pointer items-center gap-1 px-4 font-medium transition-opacity hover:opacity-70"
                                >
                                    {t("department")}
                                    {sortDir === "asc" ? (
                                        <ChevronUp className="size-4.5" />
                                    ) : (
                                        <ChevronDown className="size-4.5" />
                                    )}
                                </button>
                            </th>

                            <th className="py-4 text-left">
                                <span className="text-small text-basic-text tracking-standard px-4 font-medium">
                                    {t("position")}
                                </span>
                            </th>

                            <th className="w-18" />
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedEmployees.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="text-body text-text-secondary py-16 text-center"
                                >
                                    {t("no_employees")}
                                </td>
                            </tr>
                        ) : (
                            paginatedEmployees.map((employee) => (
                                <tr
                                    key={employee.id}
                                    className="border-divider hover:bg-hover-xs cursor-pointer border-b transition-colors"
                                    onClick={() => router.push(`/employees/${employee.id}`)}
                                >
                                    <td className="w-20 py-4 pl-4">
                                        <EmployeeAvatar
                                            avatar={employee.profile.avatar}
                                            firstName={employee.profile.first_name}
                                            email={employee.email}
                                        />
                                    </td>

                                    <td className="text-small text-basic-text tracking-standard px-4 py-4">
                                        {employee.profile.first_name ?? "—"}
                                    </td>

                                    <td className="text-small text-basic-text tracking-standard px-4 py-4">
                                        {employee.profile.last_name ?? "—"}
                                    </td>

                                    <td className="text-small text-basic-text tracking-standard px-4 py-4">
                                        {employee.email}
                                    </td>

                                    <td className="text-small text-basic-text tracking-standard px-4 py-4">
                                        {employee.department_name ?? "—"}
                                    </td>

                                    <td className="text-small text-basic-text tracking-standard px-4 py-4">
                                        {employee.position_name ?? "—"}
                                    </td>

                                    <td className="w-18 py-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/employees/${employee.id}`);
                                            }}
                                            className="hover:bg-hover-md ml-4 flex size-10 items-center justify-center rounded-full transition-colors"
                                            aria-label="View employee"
                                        >
                                            <ChevronRight className="text-text-hint size-6" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
                rowsPerPageLabel={t("rows_per_page")}
                pageLabel={t("page_of", { page, total: totalPages })}
            />
        </div>
    );
}
