"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { CREATE_LANGUAGE_MUTATION } from "@/lib/graphql/operations/languages";
import { languagesListKey } from "@/lib/hooks/useLanguageTable";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

import { LanguageForm, type LanguageFormData } from "./LanguageForm";

interface CreateLanguageModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateLanguageModal({ open, onOpenChange }: CreateLanguageModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (data: LanguageFormData) =>
            gqlClient.request(CREATE_LANGUAGE_MUTATION, {
                language: {
                    iso2: data.iso2,
                    name: data.name,
                    native_name: data.native_name,
                },
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: languagesListKey() }),
        onClose: onOpenChange,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl"
                aria-describedby={undefined}
            >
                <DialogTitle>{t("create_language_title")}</DialogTitle>
                <LanguageForm
                    submitLabel={t("create")}
                    onSubmit={(data) => handleMutate(data, t("create_language_error"))}
                    onCancel={() => handleOpenChange(false)}
                    isSubmitting={isPending}
                    error={submitError}
                />
            </DialogContent>
        </Dialog>
    );
}
