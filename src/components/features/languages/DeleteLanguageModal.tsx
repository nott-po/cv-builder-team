"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { gqlClient } from "@/lib/graphql/fetcher";
import { DELETE_LANGUAGE_MUTATION } from "@/lib/graphql/operations/languages";
import { languagesListKey, type LanguageRow } from "@/lib/hooks/useLanguageTable";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

interface DeleteLanguageModalProps {
    open: boolean;
    language: LanguageRow | null;
    onOpenChange: (open: boolean) => void;
}

export function DeleteLanguageModal({ open, language, onOpenChange }: DeleteLanguageModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (languageId: string) =>
            gqlClient.request(DELETE_LANGUAGE_MUTATION, { language: { languageId } }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: languagesListKey() }),
        onClose: onOpenChange,
    });

    return (
        <DeleteConfirmModal
            open={open}
            onOpenChange={handleOpenChange}
            title={t("delete_language_title")}
            description={
                <>
                    {t("delete_language_confirm")}{" "}
                    <strong className="text-foreground">{language?.name}</strong>?
                </>
            }
            onConfirm={() => language && handleMutate(language.id, t("delete_language_error"))}
            isPending={isPending}
            error={submitError}
        />
    );
}
