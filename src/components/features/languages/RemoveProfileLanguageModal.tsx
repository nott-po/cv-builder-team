"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { DELETE_PROFILE_LANGUAGE_MUTATION } from "@/lib/graphql/operations/languages";
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
    const tUser = useTranslations("User");
    const queryClient = useQueryClient();

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (name: string) =>
            gqlClient.request(DELETE_PROFILE_LANGUAGE_MUTATION, {
                language: { userId, name },
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: profileLanguagesKey(userId) }),
        onClose: onOpenChange,
    });

    const handleConfirm = () => {
        if (!language) return;
        handleMutate(language.name, tUser("remove_language_error"));
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-xl" aria-describedby={undefined}>
                <DialogTitle>{tUser("remove_language_title")}</DialogTitle>
                <p className="text-muted-foreground text-sm">
                    {tUser("remove_language_confirm")}{" "}
                    <strong className="text-foreground">{language?.name}</strong>?
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
                        {tUser("cancel")}
                    </Button>
                    <Button
                        type="button"
                        variant="redPrimary"
                        className="px-8 py-4"
                        onClick={handleConfirm}
                        disabled={isPending}
                    >
                        {tUser("confirm")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
