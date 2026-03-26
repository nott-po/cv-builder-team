"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { UPDATE_CV_PROJECT_MUTATION } from "@/lib/graphql/operations/cvs";
import { cvDetailKey, type CvProject } from "@/lib/hooks/useCV";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

import { CVProjectForm, type CVProjectFormValues } from "./CVProjectForm";

interface EditCVProjectModalProps {
    open: boolean;
    cvId: string;
    project: CvProject;
    onOpenChange: (open: boolean) => void;
}

export function EditCVProjectModal({ open, cvId, project, onOpenChange }: EditCVProjectModalProps) {
    const queryClient = useQueryClient();
    const t = useTranslations("CV");

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (formData: CVProjectFormValues) => {
            return gqlClient.request(UPDATE_CV_PROJECT_MUTATION, {
                project: {
                    cvId,
                    projectId: project.project.id,
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
                <DialogTitle>{t("edit_project")}</DialogTitle>

                <CVProjectForm
                    mode="edit"
                    availableProjects={[project]}
                    defaultValues={{
                        projectId: project.project.id,
                        start_date: project.start_date || "",
                        end_date: project.end_date || "",
                        roles: project.roles.join(", "),
                        responsibilities: project.responsibilities.join("\n"),
                    }}
                    onSubmit={(data) => handleMutate(data, t("edit_project_error"))}
                    onCancel={() => handleOpenChange(false)}
                    isSubmitting={isPending}
                    error={submitError}
                />
            </DialogContent>
        </Dialog>
    );
}
