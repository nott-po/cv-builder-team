"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { gqlClient } from "@/lib/graphql/fetcher";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

import { DeleteConfirmModal } from "./DeleteConfirmModal";

interface AdminDeleteModalProps<TRow extends { id: string; name: string }> {
    open: boolean;
    item: TRow | null;
    onOpenChange: (open: boolean) => void;
    mutation: string;
    buildVars: (id: string) => Record<string, unknown>;
    queryKey: readonly unknown[];
    titleKey: string;
    confirmKey: string;
    errorKey: string;
}

export function AdminDeleteModal<TRow extends { id: string; name: string }>({
    open,
    item,
    onOpenChange,
    mutation,
    buildVars,
    queryKey,
    titleKey,
    confirmKey,
    errorKey,
}: AdminDeleteModalProps<TRow>) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (id: string) => gqlClient.request(mutation, buildVars(id)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
        onClose: onOpenChange,
    });

    return (
        <DeleteConfirmModal
            open={open}
            onOpenChange={handleOpenChange}
            title={t(titleKey)}
            description={
                <>
                    {t(confirmKey)} <strong className="text-foreground">{item?.name}</strong>?
                </>
            }
            onConfirm={() => item && handleMutate(item.id, t(errorKey))}
            isPending={isPending}
            error={submitError}
        />
    );
}
