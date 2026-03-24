"use client";

import { STALE_TIME_ENTITY } from "@/lib/constants/query";
import { gqlClient } from "@/lib/graphql/fetcher";
import { SKILLS_QUERY } from "@/lib/graphql/operations/skills";
import { useSortableTable } from "@/lib/hooks/useSortableTable";
import type { SortDir } from "@/types/table";

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

const getRows = (data: SkillsQueryResult) => data.skills;
const filterRow = (row: SkillRow, lower: string) =>
    [row.name, row.category_name, row.category_parent_name].some((v) =>
        v?.toLowerCase().includes(lower),
    );
const sortRow = (a: SkillRow, b: SkillRow, dir: SortDir) => {
    const aType = a.category_parent_name ?? "";
    const bType = b.category_parent_name ?? "";
    return dir === "asc" ? aType.localeCompare(bType) : bType.localeCompare(aType);
};

export function useSkillTable(basePath = "/admin/skills") {
    const { state, paginatedRows, sortDir, handleSortToggle } = useSortableTable<
        SkillsQueryResult,
        SkillRow
    >({
        basePath,
        queryKey: skillsListKey(),
        queryFn: () => gqlClient.request<SkillsQueryResult>(SKILLS_QUERY),
        getRows,
        filterRow,
        sortRow,
        staleTime: STALE_TIME_ENTITY,
    });

    return { state, paginatedSkills: paginatedRows, sortDir, handleSortToggle };
}
