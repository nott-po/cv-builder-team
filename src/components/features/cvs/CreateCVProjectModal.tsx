"use client";

import { useTranslations } from "next-intl";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { ADD_CV_PROJECT_MUTATION } from "@/lib/graphql/operations/cvs";
import { PROJECTS_QUERY } from "@/lib/graphql/operations/projects";
import { cvDetailKey, type CvProject } from "@/lib/hooks/useCV";
import { useModalMutation } from "@/lib/hooks/useModalMutation";
import { projectsListKey, type ProjectsQueryResult } from "@/lib/hooks/useProjectTable";

import { CVProjectForm, type CVProjectFormValues } from "./CVProjectForm";

interface CreateCVProjectModalProps {
    open: boolean;
    cvId: string;
    existingProjects: CvProject[];
    onOpenChange: (open: boolean) => void;
}

export function CreateCVProjectModal({
    open,
    cvId,
    existingProjects,
    onOpenChange,
}: CreateCVProjectModalProps) {
    const queryClient = useQueryClient();
    const t = useTranslations("CV");

    const { data } = useQuery<ProjectsQueryResult>({
        queryKey: projectsListKey(),
        queryFn: () => gqlClient.request<ProjectsQueryResult>(PROJECTS_QUERY),
        enabled: open,
    });

    const availableProjects = (data?.projects ?? []).filter(
        (globalProj) => !existingProjects.some((cvProj) => cvProj.project.id === globalProj.id),
    );

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (formData: CVProjectFormValues) => {
            return gqlClient.request(ADD_CV_PROJECT_MUTATION, {
                project: {
                    cvId,
                    projectId: formData.projectId,
                    start_date: formData.start_date,
                    end_date: formData.end_date || undefined,
                    roles: formData.roles
                        .split(",")
                        .map((r) => r.trim())
                        .filter(Boolean),
                    responsibilities: formData.responsibilities
                        .split("\n")
                        .map((r) => r.trim())
                        .filter(Boolean),
                },
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: cvDetailKey(cvId) }),
        onClose: onOpenChange,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-full max-w-[calc(100vw-2rem)] sm:max-w-3xl"
                aria-describedby={undefined}
            >
                <DialogTitle>{t("add_project")}</DialogTitle>
                <CVProjectForm
                    mode="add"
                    defaultValues={{
                        projectId: "",
                        start_date: "",
                        end_date: "",
                        roles: "",
                        responsibilities: "",
                    }}
                    availableProjects={availableProjects}
                    onSubmit={(data) => handleMutate(data, t("add_project_error"))}
                    onCancel={() => handleOpenChange(false)}
                    isSubmitting={isPending}
                    error={submitError}
                />
            </DialogContent>
        </Dialog>
    );
}
