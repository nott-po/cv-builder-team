"use client";

import { useQueryClient } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { UPDATE_CV_PROJECT_MUTATION } from "@/lib/graphql/operations/cvs";
import { cvDetailKey } from "@/lib/hooks/useCV";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

import { CVProjectForm, type CVProjectFormValues } from "./CVProjectForm";

export function EditCVProjectModal({ open, cvId, project, onOpenChange }: any) {
    const queryClient = useQueryClient();

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
                <DialogTitle>Edit project</DialogTitle>

                {project && (
                    <CVProjectForm
                        mode="edit"
                        availableProjects={[project]}
                        defaultValues={{
                            projectId: project.id,
                            start_date: project.start_date || "",
                            end_date: project.end_date || "",
                            roles: (project.roles || []).join(", "),
                            responsibilities: (project.responsibilities || []).join("\n"),
                        }}
                        onSubmit={(data) => handleMutate(data, "Error")}
                        onCancel={() => handleOpenChange(false)}
                        isSubmitting={isPending}
                        error={submitError}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
