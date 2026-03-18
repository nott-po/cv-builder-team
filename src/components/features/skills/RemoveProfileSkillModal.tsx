"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { gqlClient } from "@/lib/graphql/fetcher";
import { DELETE_PROFILE_SKILL_MUTATION } from "@/lib/graphql/operations/profile";
import { useModalMutation } from "@/lib/hooks/useModalMutation";
import { profileSkillsKey, type ProfileSkillRow } from "@/lib/hooks/useProfileSkills";

interface RemoveProfileSkillModalProps {
    open: boolean;
    userId: string;
    skill: ProfileSkillRow | null;
    onOpenChange: (open: boolean) => void;
}

export function RemoveProfileSkillModal({
    open,
    userId,
    skill,
    onOpenChange,
}: RemoveProfileSkillModalProps) {
    const t = useTranslations("User");
    const queryClient = useQueryClient();

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (name: string) =>
            gqlClient.request(DELETE_PROFILE_SKILL_MUTATION, {
                skill: { userId, name: [name] },
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: profileSkillsKey(userId) }),
        onClose: onOpenChange,
    });

    return (
        <DeleteConfirmModal
            open={open}
            onOpenChange={handleOpenChange}
            title={t("remove_skill_title")}
            description={
                <>
                    {t("remove_skill_confirm")}{" "}
                    <strong className="text-foreground">{skill?.name}</strong>?
                </>
            }
            onConfirm={() => skill && handleMutate(skill.name, t("remove_skill_error"))}
            isPending={isPending}
            error={submitError}
        />
    );
}
