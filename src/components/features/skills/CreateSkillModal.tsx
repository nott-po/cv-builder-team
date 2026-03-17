"use client";

import { useTranslations } from "next-intl";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { CREATE_SKILL_MUTATION, SKILL_CATEGORIES_QUERY } from "@/lib/graphql/operations/skills";
import { useModalMutation } from "@/lib/hooks/useModalMutation";
import { skillCategoriesKey, skillsListKey } from "@/lib/hooks/useSkillTable";

import { type CategoriesResult } from "./SkillCategorySelect";
import { SkillForm, type SkillFormData } from "./SkillForm";

interface CreateSkillModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateSkillModal({ open, onOpenChange }: CreateSkillModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();

    const { data: categoriesData } = useQuery({
        queryKey: skillCategoriesKey(),
        queryFn: () => gqlClient.request<CategoriesResult>(SKILL_CATEGORIES_QUERY),
        enabled: open,
    });

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (data: SkillFormData) =>
            gqlClient.request(CREATE_SKILL_MUTATION, {
                skill: { name: data.name, categoryId: data.categoryId || undefined },
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: skillsListKey() }),
        onClose: onOpenChange,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl"
                aria-describedby={undefined}
            >
                <DialogTitle>{t("create_skill_title")}</DialogTitle>
                <SkillForm
                    submitLabel={t("create")}
                    categories={categoriesData?.skillCategories ?? []}
                    onSubmit={(data) => handleMutate(data, t("create_skill_error"))}
                    onCancel={() => handleOpenChange(false)}
                    isSubmitting={isPending}
                    error={submitError}
                />
            </DialogContent>
        </Dialog>
    );
}
