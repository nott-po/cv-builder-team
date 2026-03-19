"use client";

import { useTranslations } from "next-intl";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { SKILL_CATEGORIES_QUERY, UPDATE_SKILL_MUTATION } from "@/lib/graphql/operations/skills";
import { useModalMutation } from "@/lib/hooks/useModalMutation";
import { skillCategoriesKey, skillsListKey, type SkillRow } from "@/lib/hooks/useSkillTable";

import { type CategoriesResult } from "./SkillCategorySelect";
import { SkillForm, type SkillFormData } from "./SkillForm";

interface EditSkillModalProps {
    open: boolean;
    skill: SkillRow | null;
    onOpenChange: (open: boolean) => void;
}

export function EditSkillModal({ open, skill, onOpenChange }: EditSkillModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();
    const skillId = skill?.id;

    const { data: categoriesData } = useQuery({
        queryKey: skillCategoriesKey(),
        queryFn: () => gqlClient.request<CategoriesResult>(SKILL_CATEGORIES_QUERY),
        enabled: open,
    });

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (data: SkillFormData) => {
            if (!skillId) return Promise.reject(new Error("No skill selected"));
            return gqlClient.request(UPDATE_SKILL_MUTATION, {
                skill: {
                    skillId,
                    name: data.name,
                    categoryId: data.categoryId || undefined,
                },
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: skillsListKey() }),
        onClose: onOpenChange,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl"
                aria-describedby={undefined}
            >
                <DialogTitle>{t("edit_skill_title")}</DialogTitle>
                {skill && (
                    <SkillForm
                        submitLabel={t("save")}
                        key={skill.id}
                        initialData={{
                            name: skill.name,
                            categoryId: skill.category?.id ?? "",
                        }}
                        categories={categoriesData?.skillCategories ?? []}
                        onSubmit={(data) => handleMutate(data, t("edit_skill_error"))}
                        onCancel={() => handleOpenChange(false)}
                        isSubmitting={isPending}
                        error={submitError}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
