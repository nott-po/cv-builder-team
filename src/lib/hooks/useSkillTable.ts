"use client";

import { useMemo, useState } from "react";

import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { useRouter } from "@/i18n/routing";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/table";
import { fetcher } from "@/lib/graphql/fetcher";
import { SKILLS_QUERY } from "@/lib/graphql/operations/skills";

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

type SortDir = "asc" | "desc";

export const skillsListKey = () => ["skills", "list"] as const;
export const skillCategoriesKey = () => ["skillCategories", "list"] as const;

export function useSkillTable(basePath = "/admin/skills") {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState("");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [page, setPage] = useState(1);
    const pageSize = Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;

    const { data, isLoading, isError } = useQuery<SkillsQueryResult>({
        queryKey: skillsListKey(),
        queryFn: () => fetcher<SkillsQueryResult, Record<string, never>>(SKILLS_QUERY)(),
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
        paginatedSkills,
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
    };
}
