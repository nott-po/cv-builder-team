"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { gqlClient } from "@/lib/graphql/fetcher";
import { DELETE_SKILL_MUTATION } from "@/lib/graphql/operations/skills";
import { useModalMutation } from "@/lib/hooks/useModalMutation";
import { skillsListKey, type SkillRow } from "@/lib/hooks/useSkillTable";

interface DeleteSkillModalProps {
    open: boolean;
    skill: SkillRow | null;
    onOpenChange: (open: boolean) => void;
}

export function DeleteSkillModal({ open, skill, onOpenChange }: DeleteSkillModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (skillId: string) =>
            gqlClient.request(DELETE_SKILL_MUTATION, { skill: { skillId } }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: skillsListKey() }),
        onClose: onOpenChange,
    });

    return (
        <DeleteConfirmModal
            open={open}
            onOpenChange={handleOpenChange}
            title={t("delete_skill_title")}
            description={
                <>
                    {t("delete_skill_confirm")}{" "}
                    <strong className="text-foreground">{skill?.name}</strong>?
                </>
            }
            onConfirm={() => skill && handleMutate(skill.id, t("delete_skill_error"))}
            isPending={isPending}
            error={submitError}
        />
    );
}
