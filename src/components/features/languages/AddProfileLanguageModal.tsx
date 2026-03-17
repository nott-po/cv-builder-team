"use client";

import { useTranslations } from "next-intl";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import {
    ADD_PROFILE_LANGUAGE_MUTATION,
    LANGUAGES_QUERY,
    UPDATE_PROFILE_LANGUAGE_MUTATION,
} from "@/lib/graphql/operations/languages";
import { languagesListKey, type LanguageRow } from "@/lib/hooks/useLanguageTable";
import { useModalMutation } from "@/lib/hooks/useModalMutation";
import { profileLanguagesKey, type ProfileLanguageRow } from "@/lib/hooks/useProfileLanguages";

import { ProfileLanguageForm, type ProfileLanguageFormData } from "./ProfileLanguageForm";

interface AddProfileLanguageModalProps {
    open: boolean;
    userId: string;
    existingLanguages: ProfileLanguageRow[];
    editingLanguage?: ProfileLanguageRow | null;
    onOpenChange: (open: boolean) => void;
}

type LanguagesQueryResult = { languages: LanguageRow[] };
type MutationVars = { formData: ProfileLanguageFormData; isEditing: boolean };

export function AddProfileLanguageModal({
    open,
    userId,
    existingLanguages,
    editingLanguage,
    onOpenChange,
}: AddProfileLanguageModalProps) {
    const tUser = useTranslations("User");
    const queryClient = useQueryClient();

    const { data } = useQuery<LanguagesQueryResult>({
        queryKey: languagesListKey(),
        queryFn: () => gqlClient.request<LanguagesQueryResult>(LANGUAGES_QUERY),
        enabled: open,
    });

    const availableLanguages = (data?.languages ?? []).filter(
        (l) =>
            !existingLanguages.some((e) => e.name === l.name) || l.name === editingLanguage?.name,
    );

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: ({ formData, isEditing }: MutationVars) => {
            const vars = {
                language: { userId, name: formData.name, proficiency: formData.proficiency },
            };
            return isEditing
                ? gqlClient.request(UPDATE_PROFILE_LANGUAGE_MUTATION, vars)
                : gqlClient.request(ADD_PROFILE_LANGUAGE_MUTATION, vars);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: profileLanguagesKey(userId) }),
        onClose: onOpenChange,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl"
                aria-describedby={undefined}
            >
                <DialogTitle>
                    {editingLanguage ? tUser("edit_language_title") : tUser("add_language_title")}
                </DialogTitle>
                <ProfileLanguageForm
                    availableLanguages={availableLanguages}
                    initialData={
                        editingLanguage
                            ? {
                                  name: editingLanguage.name,
                                  proficiency: editingLanguage.proficiency,
                              }
                            : undefined
                    }
                    submitLabel={editingLanguage ? tUser("save") : tUser("create")}
                    readOnly={!!editingLanguage}
                    onSubmit={(formData) =>
                        handleMutate(
                            { formData, isEditing: !!editingLanguage },
                            editingLanguage
                                ? tUser("edit_language_error")
                                : tUser("add_language_error"),
                        )
                    }
                    onCancel={() => handleOpenChange(false)}
                    isSubmitting={isPending}
                    error={submitError}
                />
            </DialogContent>
        </Dialog>
    );
}
