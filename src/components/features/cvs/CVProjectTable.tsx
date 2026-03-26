"use client";

import { Fragment, useMemo, useState } from "react";

import { useTranslations } from "next-intl";

import { Plus } from "lucide-react";

import { CreateCVProjectModal } from "@/components/features/cvs/CreateCVProjectModal";
import { EditCVProjectModal } from "@/components/features/cvs/EditCVProjectModal";
import { ProjectTableSkeleton } from "@/components/features/projects/admin/ProjectTableSkeleton";
import { DataTable } from "@/components/shared/DataTable";
import { RemoveProfileItemModal } from "@/components/shared/RemoveProfileItemModal";
import { RowActionsDropdown } from "@/components/shared/RowActionsDropdown";
import { SortableColumnHeader } from "@/components/shared/SortableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gqlClient } from "@/lib/graphql/fetcher";
import { REMOVE_CV_PROJECT_MUTATION } from "@/lib/graphql/operations/cvs";
import { useCv, cvDetailKey } from "@/lib/hooks/useCV";
import { formatDateForDisplay } from "@/lib/utils/date";
import type { SortDir, TableState } from "@/types/table";

interface CVProjectTableProps {
    cvId: string;
    readOnly?: boolean;
}

export function CVProjectTable({ cvId, readOnly = false }: CVProjectTableProps) {
    const t = useTranslations("CV");
    const tillNow = t("till_now", { fallback: "Till now" });

    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [removeOpen, setRemoveOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<any | null>(null);
    const [removingProject, setRemovingProject] = useState<any | null>(null);

    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { cv, isLoading, isError } = useCv(cvId);
    const cvProjects = cv?.projects || [];

    const filteredProjects = useMemo(() => {
        if (!search.trim()) return cvProjects;

        const lowerSearch = search.toLowerCase();
        return cvProjects.filter((project) => {
            const matchName = project.name.toLowerCase().includes(lowerSearch);
            const matchRoles = (project.roles || []).join(" ").toLowerCase().includes(lowerSearch);
            const matchDesc = (project.description || "").toLowerCase().includes(lowerSearch);
            return matchName || matchRoles || matchDesc;
        });
    }, [cvProjects, search]);

    const sortedProjects = useMemo(() => {
        return [...filteredProjects].sort((a, b) =>
            sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
        );
    }, [filteredProjects, sortDir]);

    const paginatedProjects = useMemo(() => {
        const startIndex = (page - 1) * pageSize;
        return sortedProjects.slice(startIndex, startIndex + pageSize);
    }, [sortedProjects, page, pageSize]);

    const totalPages = Math.ceil(sortedProjects.length / pageSize) || 1;

    const handleSortToggle = () => setSortDir((d) => (d === "asc" ? "desc" : "asc"));

    const tableState: TableState = {
        isLoading,
        isError,
        isEmpty: cvProjects.length === 0,
        search,
        onSearchChange: (newSearch) => {
            setSearch(newSearch);
            setPage(1);
        },
        page,
        pageSize,
        totalPages,
        onPageChange: setPage,
        onPageSizeChange: (newSize) => {
            setPageSize(newSize);
            setPage(1);
        },
    };

    return (
        <div>
            <DataTable
                state={tableState}
                messages={{
                    empty: t("no_projects", { fallback: t("no_projects") }),
                    error: t("error"),
                }}
                searchPlaceholder={t("name")}
                skeleton={<ProjectTableSkeleton rows={5} />}
                actions={
                    !readOnly && (
                        <Button variant="redText" onClick={() => setAddOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t("add_project")}
                        </Button>
                    )
                }
                colSpan={5}
                head={
                    <>
                        <SortableColumnHeader
                            label={t("name")}
                            sortDir={sortDir}
                            onToggle={handleSortToggle}
                        />
                        <th className="py-4 text-left">
                            <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                                {t("roles")}
                            </span>
                        </th>
                        <th className="py-4 text-left">
                            <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                                {t("start_date")}
                            </span>
                        </th>
                        <th className="py-4 text-left">
                            <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                                {t("end_date")}
                            </span>
                        </th>
                        <th className="w-18" />
                    </>
                }
            >
                {paginatedProjects.map((project) => (
                    <Fragment key={project.id}>
                        <tr>
                            <td className="text-small text-basic-text tracking-standard px-4 pt-4 pb-1 font-medium">
                                {project.name}
                            </td>
                            <td className="text-small text-basic-text tracking-standard px-4 pt-4 pb-1">
                                {(project.roles || []).join(", ")}
                            </td>
                            <td className="text-small text-basic-text tracking-standard px-4 pt-4 pb-1 whitespace-nowrap">
                                {formatDateForDisplay(project.start_date, tillNow)}
                            </td>
                            <td className="text-small text-basic-text tracking-standard px-4 pt-4 pb-1 whitespace-nowrap">
                                {formatDateForDisplay(project.end_date, tillNow)}
                            </td>
                            <td className="w-18 pt-4 pb-1">
                                {!readOnly && (
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }}
                                    >
                                        <RowActionsDropdown
                                            ariaLabel="Project actions"
                                            onEdit={() => {
                                                setEditingProject(project);
                                                setEditOpen(true);
                                            }}
                                            onDelete={() => {
                                                setRemovingProject(project);
                                                setRemoveOpen(true);
                                            }}
                                        />
                                    </div>
                                )}
                            </td>
                        </tr>

                        <tr className="border-divider border-b">
                            <td colSpan={5} className="px-4 pb-4">
                                {project.description && (
                                    <p className="text-small text-text-secondary tracking-standard mb-3 leading-relaxed">
                                        {project.description}
                                    </p>
                                )}
                                {project.environment && project.environment.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {project.environment.map((tag: string) => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </td>
                        </tr>
                    </Fragment>
                ))}
            </DataTable>

            {!readOnly && (
                <>
                    <CreateCVProjectModal
                        open={addOpen}
                        cvId={cvId}
                        existingProjects={cvProjects}
                        onOpenChange={setAddOpen}
                    />

                    {editingProject && (
                        <EditCVProjectModal
                            open={editOpen}
                            cvId={cvId}
                            project={editingProject}
                            onOpenChange={setEditOpen}
                        />
                    )}

                    <RemoveProfileItemModal
                        open={removeOpen}
                        onOpenChange={(v) => {
                            setRemoveOpen(v);
                            if (!v) setRemovingProject(null);
                        }}
                        title={t("remove_project_title")}
                        confirmText={t("remove_project_confirm")}
                        itemName={removingProject?.name}
                        errorMessage={t("error")}
                        mutationFn={() =>
                            gqlClient.request(REMOVE_CV_PROJECT_MUTATION, {
                                project: {
                                    cvId,
                                    projectId: removingProject?.project?.id,
                                },
                            })
                        }
                        queryKey={cvDetailKey(cvId)}
                    />
                </>
            )}
        </div>
    );
}
