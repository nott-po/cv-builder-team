"use client";

import { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { fetcher } from "@/lib/graphql/fetcher";
import { PROJECTS_QUERY } from "@/lib/graphql/operations/projects";
import { useTablePagination } from "@/lib/hooks/useTablePagination";
import type { SortDir, TableState } from "@/types/table";

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

export function useProjectTable(basePath = "/admin/projects") {
    const { page, setPage, pageSize, handlePageChange, handlePageSizeChange } =
        useTablePagination(basePath);

    const [search, setSearch] = useState("");
    const [sortDir, setSortDir] = useState<SortDir>("asc");

    const { data, isLoading, isError } = useQuery<ProjectsQueryResult>({
        queryKey: projectsListKey(),
        queryFn: () => fetcher<ProjectsQueryResult, Record<string, never>>(PROJECTS_QUERY)(),
    });

    const projects = useMemo(() => {
        if (!data?.projects) return [];

        let result = data.projects;

        if (search.trim()) {
            const lower = search.toLowerCase();
            result = result.filter((p) =>
                [p.name, p.domain, p.description].some((v) => v?.toLowerCase().includes(lower)),
            );
        }

        return [...result].sort((a, b) =>
            sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
        );
    }, [data, search, sortDir]);

    const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));
    const paginatedProjects = projects.slice((page - 1) * pageSize, page * pageSize);

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
        isEmpty: projects.length === 0,
        search,
        onSearchChange: handleSearchChange,
        page,
        pageSize,
        totalPages,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,
    };

    return { state, paginatedProjects, sortDir, handleSortToggle };
}
