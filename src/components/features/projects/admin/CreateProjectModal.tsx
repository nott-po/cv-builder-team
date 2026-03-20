"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { CREATE_PROJECT_MUTATION } from "@/lib/graphql/operations/projects";
import { useModalMutation } from "@/lib/hooks/useModalMutation";
import { projectsListKey } from "@/lib/hooks/useProjectTable";

import { ProjectForm, type ProjectFormData } from "./ProjectForm";

interface CreateProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateProjectModal({ open, onOpenChange }: CreateProjectModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (data: ProjectFormData) =>
            gqlClient.request(CREATE_PROJECT_MUTATION, {
                project: {
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
                <DialogTitle>{t("create_project_title")}</DialogTitle>
                <ProjectForm
                    submitLabel={t("create")}
                    onSubmit={(data) => handleMutate(data, t("create_project_error"))}
                    onCancel={() => handleOpenChange(false)}
                    isSubmitting={isPending}
                    error={submitError}
                />
            </DialogContent>
        </Dialog>
    );
}
