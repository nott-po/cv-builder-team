"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";
import { ClientError } from "graphql-request";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { CREATE_CV_MUTATION } from "@/lib/graphql/operations/cvs";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { cvsListKey } from "@/lib/hooks/useCvTable";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

import { CvForm, type CreateCvFormData } from "./CVForm";

interface CreateCVModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type CvInputData = {
    name: string;
    education: string;
    description: string;
    userId: string;
};

export function CreateCVModal({ open, onOpenChange }: CreateCVModalProps) {
    const t = useTranslations("CV");
    const queryClient = useQueryClient();
    const { user } = useCurrentUser();
    const currentUserId = user?.id as string;

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (cvInput: CvInputData) =>
            gqlClient.request(CREATE_CV_MUTATION, { cv: cvInput }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cvsListKey(currentUserId) });
        },
        onClose: onOpenChange,
    });

    const handleSubmit = async (data: CreateCvFormData) => {
        await handleMutate(
            {
                name: data.name,
                education: data.education || "",
                description: data.description,
                userId: currentUserId,
            },
            (err) => {
                if (err instanceof ClientError) {
                    return err.response.errors?.[0]?.message || t("create_cv_error");
                }
                return t("create_cv_error");
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="border-border bg-surface w-full max-w-[calc(100vw-2rem)] sm:max-w-3xl"
                aria-describedby={undefined}
            >
                <DialogTitle className="text-basic-text text-xl font-medium">
                    {t("create_cv")}
                </DialogTitle>

                <CvForm
                    onSubmit={handleSubmit}
                    onCancel={() => handleOpenChange(false)}
                    isSubmitting={isPending}
                    error={submitError}
                />
            </DialogContent>
        </Dialog>
    );
}
