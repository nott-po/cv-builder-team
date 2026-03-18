"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-xl" aria-describedby={undefined}>
                <DialogTitle>{t("delete_position_title")}</DialogTitle>
                <p className="text-muted-foreground text-sm">
                    {t("delete_position_confirm")}{" "}
                    <strong className="text-foreground">{position?.name}</strong>?
                </p>
                {submitError && <p className="text-destructive text-sm">{submitError}</p>}
                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="transparent"
                        className="px-8 py-4"
                        onClick={() => handleOpenChange(false)}
                        disabled={isPending}
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        type="button"
                        variant="redPrimary"
                        className="px-8 py-4"
                        onClick={() =>
                            position && handleMutate(position.id, t("delete_position_error"))
                        }
                        disabled={isPending}
                    >
                        {t("confirm")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
