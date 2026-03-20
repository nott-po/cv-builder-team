"use client";

import { Fragment, useState } from "react";

import { useTranslations } from "next-intl";

import { Plus } from "lucide-react";

import { AdminDeleteModal } from "@/components/shared/AdminDeleteModal";
import { DataTable } from "@/components/shared/DataTable";
import { RowActionsDropdown } from "@/components/shared/RowActionsDropdown";
import { SortableColumnHeader } from "@/components/shared/SortableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DELETE_PROJECT_MUTATION } from "@/lib/graphql/operations/projects";
import { projectsListKey, useProjectTable, type ProjectRow } from "@/lib/hooks/useProjectTable";
import { formatDateForDisplay } from "@/lib/utils/date";

import { CreateProjectModal } from "./CreateProjectModal";
import { EditProjectModal } from "./EditProjectModal";
import { ProjectTableSkeleton } from "./ProjectTableSkeleton";

export function AdminProjectTable() {
    const t = useTranslations("Admin");
    const { state, paginatedProjects, sortDir, handleSortToggle } = useProjectTable();

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editProject, setEditProject] = useState<ProjectRow | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteProject, setDeleteProject] = useState<ProjectRow | null>(null);

    const tillNow = t("till_now");

    return (
        <>
            <DataTable
                state={state}
                messages={{ empty: t("no_projects"), error: t("error") }}
                searchPlaceholder={t("name")}
                actions={
                    <Button variant="redText" onClick={() => setCreateOpen(true)}>
                        <Plus />
                        {t("create_project")}
                    </Button>
                }
                skeleton={<ProjectTableSkeleton rows={state.pageSize} />}
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
                                {t("domain")}
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
                        {/* Main info row */}
                        <tr>
                            <td className="text-small text-basic-text tracking-standard px-4 pt-4 pb-1 font-medium">
                                {project.name}
                            </td>
                            <td className="text-small text-basic-text tracking-standard px-4 pt-4 pb-1">
                                {project.domain}
                            </td>
                            <td className="text-small text-basic-text tracking-standard px-4 pt-4 pb-1 whitespace-nowrap">
                                {formatDateForDisplay(project.start_date, tillNow)}
                            </td>
                            <td className="text-small text-basic-text tracking-standard px-4 pt-4 pb-1 whitespace-nowrap">
                                {formatDateForDisplay(project.end_date, tillNow)}
                            </td>
                            <td className="w-18 pt-4 pb-1">
                                <RowActionsDropdown
                                    ariaLabel={t("project_actions")}
                                    onEdit={() => {
                                        setEditProject(project);
                                        setEditOpen(true);
                                    }}
                                    onDelete={() => {
                                        setDeleteProject(project);
                                        setDeleteOpen(true);
                                    }}
                                />
                            </td>
                        </tr>

                        {/* Description + environment tags row */}
                        <tr className="border-divider border-b">
                            <td colSpan={5} className="px-4 pb-4">
                                {project.description && (
                                    <p className="text-small text-text-secondary tracking-standard mb-3 leading-relaxed">
                                        {project.description}
                                    </p>
                                )}
                                {project.environment.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {project.environment.map((tag) => (
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

            <CreateProjectModal open={createOpen} onOpenChange={setCreateOpen} />
            <EditProjectModal open={editOpen} project={editProject} onOpenChange={setEditOpen} />
            <AdminDeleteModal
                open={deleteOpen}
                item={deleteProject}
                onOpenChange={setDeleteOpen}
                mutation={DELETE_PROJECT_MUTATION}
                buildVars={(id) => ({ project: { projectId: id } })}
                queryKey={projectsListKey()}
                titleKey="delete_project_title"
                confirmKey="delete_project_confirm"
                errorKey="delete_project_error"
            />
        </>
    );
}
