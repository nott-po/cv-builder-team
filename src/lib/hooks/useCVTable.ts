"use client";

import { useMemo, useState } from "react";

import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { useRouter } from "@/i18n/routing";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/table";
import { gqlClient } from "@/lib/graphql/fetcher";
import { USER_CVS_QUERY } from "@/lib/graphql/operations/cvs";

export type CvRow = {
    id: string;
    created_at: string;
    name: string;
    education?: string | null;
    description: string;
    user?: {
        id: string;
        email?: string;
    } | null;
};

type CvsQueryResult = {
    cvs: CvRow[];
};

type SortDir = "asc" | "desc";

export const cvsListKey = (userId: string) => ["cvs", userId] as const;

export function useCVTable(userId: string, basePath = "/cvs") {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState("");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [page, setPage] = useState(1);
    const pageSize = Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;

    const { data, isLoading, isError, refetch } = useQuery<CvsQueryResult>({
        enabled: Boolean(userId),
        queryKey: cvsListKey(userId),
        queryFn: async () => {
            const response = await gqlClient.request<CvsQueryResult>(USER_CVS_QUERY);
            const filteredCvs = response.cvs.filter((cv) => cv.user?.id === userId);
            return { cvs: filteredCvs };
        },
    });

    const processedCvs = useMemo(() => {
        if (!data?.cvs) return [];

        let result = data.cvs;

        if (search.trim()) {
            const lower = search.toLowerCase();
            result = result.filter((cv) =>
                [cv.name, cv.education, cv.description, cv.user?.email].some((val) =>
                    val?.toLowerCase().includes(lower),
                ),
            );
        }

        return [...result].sort((a, b) => {
            const aName = a.name ?? "";
            const bName = b.name ?? "";
            return sortDir === "asc" ? aName.localeCompare(bName) : bName.localeCompare(aName);
        });
    }, [data, search, sortDir]);

    const totalPages = Math.max(1, Math.ceil(processedCvs.length / pageSize));
    const paginatedCvs = processedCvs.slice((page - 1) * pageSize, page * pageSize);

    function handleSearchChange(value: string) {
        setSearch(value);
        setPage(1);
    }

    function handleSortToggle() {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        setPage(1);
    }

    function handleRowClick(cvId: string) {
        router.push(`${basePath}/${cvId}`);
    }

    function handlePageChange(newPage: number) {
        setPage(newPage);
    }

    function handlePageSizeChange(size: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("pageSize", String(size));
        router.push(`${basePath}?${params.toString()}`);
        setPage(1);
    }

    return {
        paginatedCvs,
        isLoading,
        isError,
        search,
        handleSearchChange,
        sortDir,
        handleSortToggle,
        page,
        pageSize,
        totalPages,
        handlePageChange,
        handlePageSizeChange,
        refetch,
        handleRowClick,
    };
}
