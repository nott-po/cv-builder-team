"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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

    const handleConfirm = () => {
        if (!language) return;
        handleMutate(language.id, t("delete_language_error"));
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-xl" aria-describedby={undefined}>
                <DialogTitle>{t("delete_language_title")}</DialogTitle>
                <p className="text-muted-foreground text-sm">
                    {t("delete_language_confirm")}{" "}
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
                        {t("cancel")}
                    </Button>
                    <Button
                        type="button"
                        variant="redPrimary"
                        className="px-8 py-4"
                        onClick={handleConfirm}
                        disabled={isPending}
                    >
                        {t("confirm")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
