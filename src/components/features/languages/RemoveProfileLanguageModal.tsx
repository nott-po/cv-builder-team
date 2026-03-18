"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { gqlClient } from "@/lib/graphql/fetcher";
import { DELETE_PROFILE_LANGUAGE_MUTATION } from "@/lib/graphql/operations/profile";
import { useModalMutation } from "@/lib/hooks/useModalMutation";
import { profileLanguagesKey, type ProfileLanguageRow } from "@/lib/hooks/useProfileLanguages";

interface RemoveProfileLanguageModalProps {
    open: boolean;
    userId: string;
    language: ProfileLanguageRow | null;
    onOpenChange: (open: boolean) => void;
}

export function RemoveProfileLanguageModal({
    open,
    userId,
    language,
    onOpenChange,
}: RemoveProfileLanguageModalProps) {
    const t = useTranslations("User");
    const queryClient = useQueryClient();

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (name: string) =>
            gqlClient.request(DELETE_PROFILE_LANGUAGE_MUTATION, {
                language: { userId, name },
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: profileLanguagesKey(userId) }),
        onClose: onOpenChange,
    });

    return (
        <DeleteConfirmModal
            open={open}
            onOpenChange={handleOpenChange}
            title={t("remove_language_title")}
            description={
                <>
                    {t("remove_language_confirm")}{" "}
                    <strong className="text-foreground">{language?.name}</strong>?
                </>
            }
            onConfirm={() => language && handleMutate(language.name, t("remove_language_error"))}
            isPending={isPending}
            error={submitError}
        />
    );
}
