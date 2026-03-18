"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { CREATE_POSITION_MUTATION } from "@/lib/graphql/operations/positions";
import { useModalMutation } from "@/lib/hooks/useModalMutation";
import { positionsListKey } from "@/lib/hooks/usePositionTable";

import { PositionForm, type PositionFormData } from "./PositionForm";

interface CreatePositionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreatePositionModal({ open, onOpenChange }: CreatePositionModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (data: PositionFormData) =>
            gqlClient.request(CREATE_POSITION_MUTATION, {
                position: { name: data.name },
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: positionsListKey() }),
        onClose: onOpenChange,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-full max-w-[calc(100vw-2rem)] sm:max-w-lg"
                aria-describedby={undefined}
            >
                <DialogTitle>{t("create_position_title")}</DialogTitle>
                <PositionForm
                    submitLabel={t("create")}
                    onSubmit={(data) => handleMutate(data, t("create_position_error"))}
                    onCancel={() => handleOpenChange(false)}
                    isSubmitting={isPending}
                    error={submitError}
                />
            </DialogContent>
        </Dialog>
    );
}
