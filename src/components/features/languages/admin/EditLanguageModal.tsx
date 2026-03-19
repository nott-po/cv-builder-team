"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { UPDATE_LANGUAGE_MUTATION } from "@/lib/graphql/operations/languages";
import { languagesListKey, type LanguageRow } from "@/lib/hooks/useLanguageTable";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

import { LanguageForm, type LanguageFormData } from "./LanguageForm";

interface EditLanguageModalProps {
    open: boolean;
    language: LanguageRow | null;
    onOpenChange: (open: boolean) => void;
}

export function EditLanguageModal({ open, language, onOpenChange }: EditLanguageModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();
    const languageId = language?.id;

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (data: LanguageFormData) => {
            if (!languageId) return Promise.reject(new Error("No language selected"));
            return gqlClient.request(UPDATE_LANGUAGE_MUTATION, {
                language: {
                    languageId,
                    iso2: data.iso2,
                    name: data.name,
                    native_name: data.native_name,
                },
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: languagesListKey() }),
        onClose: onOpenChange,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl"
                aria-describedby={undefined}
            >
                <DialogTitle>{t("edit_language_title")}</DialogTitle>
                {language && (
                    <LanguageForm
                        submitLabel={t("save")}
                        key={language.id}
                        initialData={{
                            iso2: language.iso2,
                            name: language.name,
                            native_name: language.native_name ?? "",
                        }}
                        onSubmit={(data) => handleMutate(data, t("edit_language_error"))}
                        onCancel={() => handleOpenChange(false)}
                        isSubmitting={isPending}
                        error={submitError}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
