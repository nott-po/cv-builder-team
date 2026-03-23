"use client";

import { STALE_TIME_ENTITY } from "@/lib/constants/query";
import { gqlClient } from "@/lib/graphql/fetcher";
import { PROJECTS_QUERY } from "@/lib/graphql/operations/projects";
import { useSortableTable } from "@/lib/hooks/useSortableTable";
import type { SortDir } from "@/types/table";

export type ProjectRow = {
    id: string;
    name: string;
    domain: string;
    start_date: string;
    end_date: string | null;
    description: string;
    environment: string[];
};

export type ProjectsQueryResult = {
    projects: ProjectRow[];
};

export const projectsListKey = () => ["projects", "list"] as const;

const getRows = (data: ProjectsQueryResult) => data.projects;
const filterRow = (row: ProjectRow, lower: string) =>
    [row.name, row.domain, row.description].some((v) => v?.toLowerCase().includes(lower));
const sortRow = (a: ProjectRow, b: ProjectRow, dir: SortDir) =>
    dir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);

export function useProjectTable(basePath = "/admin/projects") {
    const { state, paginatedRows, sortDir, handleSortToggle } = useSortableTable<
        ProjectsQueryResult,
        ProjectRow
    >({
        basePath,
        queryKey: projectsListKey(),
        queryFn: () => gqlClient.request<ProjectsQueryResult>(PROJECTS_QUERY),
        getRows,
        filterRow,
        sortRow,
        staleTime: STALE_TIME_ENTITY,
    });

    return { state, paginatedProjects: paginatedRows, sortDir, handleSortToggle };
}
