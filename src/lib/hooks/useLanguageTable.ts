"use client";

import { useMemo, useState } from "react";

import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { useRouter } from "@/i18n/routing";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/table";
import { fetcher } from "@/lib/graphql/fetcher";
import { LANGUAGES_QUERY } from "@/lib/graphql/operations/languages";

export type LanguageRow = {
    id: string;
    iso2: string;
    name: string;
    native_name: string | null;
};

type LanguagesQueryResult = {
    languages: LanguageRow[];
};

export const languagesListKey = () => ["languages", "list"] as const;

export function useLanguageTable(basePath = "/admin/languages") {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;

    const { data, isLoading, isError } = useQuery<LanguagesQueryResult>({
        queryKey: languagesListKey(),
        queryFn: () => fetcher<LanguagesQueryResult, Record<string, never>>(LANGUAGES_QUERY)(),
    });

    const languages = useMemo(() => {
        if (!data?.languages) return [];

        if (!search.trim()) return data.languages;

        const lower = search.toLowerCase();
        return data.languages.filter((l) =>
            [l.name, l.iso2, l.native_name].some((v) => v?.toLowerCase().includes(lower)),
        );
    }, [data, search]);

    const totalPages = Math.max(1, Math.ceil(languages.length / pageSize));
    const paginatedLanguages = languages.slice((page - 1) * pageSize, page * pageSize);

    function handleSearchChange(value: string) {
        setSearch(value);
        setPage(1);
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
        paginatedLanguages,
        isLoading,
        isError,
        search,
        handleSearchChange,
        page,
        pageSize,
        totalPages,
        handlePageChange,
        handlePageSizeChange,
    };
}
