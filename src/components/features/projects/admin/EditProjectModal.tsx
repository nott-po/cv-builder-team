"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { UPDATE_PROJECT_MUTATION } from "@/lib/graphql/operations/projects";
import { useModalMutation } from "@/lib/hooks/useModalMutation";
import { projectsListKey, type ProjectRow } from "@/lib/hooks/useProjectTable";

import { ProjectForm, type ProjectFormData } from "./ProjectForm";

interface EditProjectModalProps {
    open: boolean;
    project: ProjectRow | null;
    onOpenChange: (open: boolean) => void;
}

export function EditProjectModal({ open, project, onOpenChange }: EditProjectModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (data: ProjectFormData) =>
            gqlClient.request(UPDATE_PROJECT_MUTATION, {
                project: {
                    projectId: project!.id,
                    name: data.name,
                    domain: data.domain,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    description: data.description,
                    environment: data.environment,
                },
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: projectsListKey() }),
        onClose: onOpenChange,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl"
                aria-describedby={undefined}
            >
                <DialogTitle>{t("edit_project_title")}</DialogTitle>
                {project && (
                    <ProjectForm
                        submitLabel={t("update")}
                        key={project.id}
                        initialData={{
                            name: project.name,
                            domain: project.domain,
                            start_date: project.start_date,
                            end_date: project.end_date ?? "",
                            description: project.description,
                            environment: project.environment,
                        }}
                        onSubmit={(data) => handleMutate(data, t("edit_project_error"))}
                        onCancel={() => handleOpenChange(false)}
                        isSubmitting={isPending}
                        error={submitError}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
