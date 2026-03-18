"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { SimpleNameForm, type SimpleNameFormData } from "@/components/shared/SimpleNameForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { UPDATE_POSITION_MUTATION } from "@/lib/graphql/operations/positions";
import { useModalMutation } from "@/lib/hooks/useModalMutation";
import { positionsListKey, type PositionRow } from "@/lib/hooks/usePositionTable";

interface EditPositionModalProps {
    open: boolean;
    position: PositionRow | null;
    onOpenChange: (open: boolean) => void;
}

export function EditPositionModal({ open, position, onOpenChange }: EditPositionModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();
    const positionId = position?.id;

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (data: SimpleNameFormData) => {
            if (!positionId) return Promise.reject(new Error("No position selected"));
            return gqlClient.request(UPDATE_POSITION_MUTATION, {
                position: { positionId, name: data.name },
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: positionsListKey() }),
        onClose: onOpenChange,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-full max-w-[calc(100vw-2rem)] sm:max-w-lg"
                aria-describedby={undefined}
            >
                <DialogTitle>{t("edit_position_title")}</DialogTitle>
                {position && (
                    <SimpleNameForm
                        key={position.id}
                        submitLabel={t("save")}
                        initialData={{ name: position.name }}
                        onSubmit={(data) => handleMutate(data, t("edit_position_error"))}
                        onCancel={() => handleOpenChange(false)}
                        isSubmitting={isPending}
                        error={submitError}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
