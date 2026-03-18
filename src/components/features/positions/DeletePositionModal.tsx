"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { gqlClient } from "@/lib/graphql/fetcher";
import { DELETE_POSITION_MUTATION } from "@/lib/graphql/operations/positions";
import { useModalMutation } from "@/lib/hooks/useModalMutation";
import { positionsListKey, type PositionRow } from "@/lib/hooks/usePositionTable";

interface DeletePositionModalProps {
    open: boolean;
    position: PositionRow | null;
    onOpenChange: (open: boolean) => void;
}

export function DeletePositionModal({ open, position, onOpenChange }: DeletePositionModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (positionId: string) =>
            gqlClient.request(DELETE_POSITION_MUTATION, { position: { positionId } }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: positionsListKey() }),
        onClose: onOpenChange,
    });

    return (
        <DeleteConfirmModal
            open={open}
            onOpenChange={handleOpenChange}
            title={t("delete_position_title")}
            description={
                <>
                    {t("delete_position_confirm")}{" "}
                    <strong className="text-foreground">{position?.name}</strong>?
                </>
            }
            onConfirm={() => position && handleMutate(position.id, t("delete_position_error"))}
            isPending={isPending}
            error={submitError}
        />
    );
}
