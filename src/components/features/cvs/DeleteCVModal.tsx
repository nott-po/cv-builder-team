"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { gqlClient } from "@/lib/graphql/fetcher";
import { DELETE_CV_MUTATION } from "@/lib/graphql/operations/cvs";
import { type CvRow } from "@/lib/hooks/useCVTable";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

interface DeleteCVModalProps {
    open: boolean;
    cv: CvRow | null;
    onOpenChange: (open: boolean) => void;
}

export function DeleteCVModal({ open, cv, onOpenChange }: DeleteCVModalProps) {
    const t = useTranslations("CV");
    const queryClient = useQueryClient();

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (cvId: string) => gqlClient.request(DELETE_CV_MUTATION, { cv: { cvId } }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cvs"] });
        },
        onClose: onOpenChange,
    });

    return (
        <DeleteConfirmModal
            open={open}
            onOpenChange={handleOpenChange}
            title={t("delete_cv")}
            description={
                <>
                    {t("delete_cv_text")} <strong className="text-foreground">{cv?.name}</strong>?
                </>
            }
            onConfirm={() => cv && handleMutate(cv.id, t("delete_cv_error"))}
            isPending={isPending}
            error={submitError}
        />
    );
}
