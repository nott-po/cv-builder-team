"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";

import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

interface RemoveProfileItemModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    /** The "Are you sure you want to remove" text — item name is appended automatically. */
    confirmText: string;
    itemName: string | null | undefined;
    errorMessage: string;
    mutationFn: (name: string) => Promise<unknown>;
    queryKey: QueryKey;
}

export function RemoveProfileItemModal({
    open,
    onOpenChange,
    title,
    confirmText,
    itemName,
    errorMessage,
    mutationFn,
    queryKey,
}: RemoveProfileItemModalProps) {
    const queryClient = useQueryClient();

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
        onClose: onOpenChange,
    });

    return (
        <DeleteConfirmModal
            open={open}
            onOpenChange={handleOpenChange}
            title={title}
            description={
                <>
                    {confirmText} <strong className="text-foreground">{itemName}</strong>?
                </>
            }
            onConfirm={() => itemName && handleMutate(itemName, errorMessage)}
            isPending={isPending}
            error={submitError}
        />
    );
}
