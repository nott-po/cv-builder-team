"use client";

import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { STALE_TIME_ENTITY } from "@/lib/constants/query";
import { gqlClient } from "@/lib/graphql/fetcher";
import { SKILLS_QUERY } from "@/lib/graphql/operations/skills";
import { useTablePagination } from "@/lib/hooks/useTablePagination";
import type { SortDir, TableState } from "@/types/table";

export type SkillRow = {
    id: string;
    name: string;
    category_name: string | null;
    category_parent_name: string | null;
    category: { id: string; name: string } | null;
};

export type SkillsQueryResult = {
    skills: SkillRow[];
};

export const skillsListKey = () => ["skills", "list"] as const;
export const skillCategoriesKey = () => ["skillCategories", "list"] as const;

export function useSkillTable(basePath = "/admin/skills") {
    const { page, setPage, pageSize, handlePageChange, handlePageSizeChange } =
        useTablePagination(basePath);

    const [search, setSearch] = useState("");
    const [sortDir, setSortDir] = useState<SortDir>("asc");

    const { data, isLoading, isError } = useQuery<SkillsQueryResult>({
        queryKey: skillsListKey(),
        queryFn: () => gqlClient.request<SkillsQueryResult>(SKILLS_QUERY),
        staleTime: STALE_TIME_ENTITY,
    });

    const skills = useMemo(() => {
        if (!data?.skills) return [];

        let result = data.skills;

        if (search.trim()) {
            const lower = search.toLowerCase();
            result = result.filter((s) =>
                [s.name, s.category_name, s.category_parent_name].some((v) =>
                    v?.toLowerCase().includes(lower),
                ),
            );
        }

        return [...result].sort((a, b) => {
            const aType = a.category_parent_name ?? "";
            const bType = b.category_parent_name ?? "";
            return sortDir === "asc" ? aType.localeCompare(bType) : bType.localeCompare(aType);
        });
    }, [data, search, sortDir]);

    const totalPages = Math.max(1, Math.ceil(skills.length / pageSize));
    const paginatedSkills = skills.slice((page - 1) * pageSize, page * pageSize);

    function handleSearchChange(value: string) {
        setSearch(value);
        setPage(1);
    }

    function handleSortToggle() {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        setPage(1);
    }

    const state: TableState = {
        isLoading,
        isError,
        isEmpty: skills.length === 0,
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
        paginatedSkills,
        sortDir,
        handleSortToggle,
    };
}
