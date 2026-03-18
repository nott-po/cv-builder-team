"use client";

import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { fetcher } from "@/lib/graphql/fetcher";
import { LANGUAGES_QUERY } from "@/lib/graphql/operations/languages";
import { useTablePagination } from "@/lib/hooks/useTablePagination";
import type { TableState } from "@/types/table";

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
    const { page, setPage, pageSize, handlePageChange, handlePageSizeChange } =
        useTablePagination(basePath);

    const [search, setSearch] = useState("");

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

    const state: TableState = {
        isLoading,
        isError,
        isEmpty: languages.length === 0,
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
        paginatedLanguages,
    };
}
