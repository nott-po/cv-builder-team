"use client";

import { fetcher } from "@/lib/graphql/fetcher";
import { LANGUAGES_QUERY } from "@/lib/graphql/operations/languages";
import { useSimpleTable } from "@/lib/hooks/useSimpleTable";

export type LanguageRow = {
    id: string;
    iso2: string;
    name: string;
    native_name: string | null;
};

export type LanguagesQueryResult = {
    languages: LanguageRow[];
};

export const languagesListKey = () => ["languages", "list"] as const;

const getLanguageRows = (data: LanguagesQueryResult) => data.languages;
const filterLanguageRow = (row: LanguageRow, lower: string) =>
    [row.name, row.iso2, row.native_name].some((v) => v?.toLowerCase().includes(lower));

export function useLanguageTable(basePath = "/admin/languages") {
    const { state, paginatedRows } = useSimpleTable<LanguagesQueryResult, LanguageRow>({
        basePath,
        queryKey: languagesListKey(),
        queryFn: () => fetcher<LanguagesQueryResult, Record<string, never>>(LANGUAGES_QUERY)(),
        getRows: getLanguageRows,
        filterRow: filterLanguageRow,
    });

    return { state, paginatedLanguages: paginatedRows };
}
