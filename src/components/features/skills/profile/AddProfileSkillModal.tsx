"use client";

import { useTranslations } from "next-intl";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import {
    ADD_PROFILE_SKILL_MUTATION,
    UPDATE_PROFILE_SKILL_MUTATION,
} from "@/lib/graphql/operations/profile";
import { SKILLS_QUERY } from "@/lib/graphql/operations/skills";
import { useModalMutation } from "@/lib/hooks/useModalMutation";
import { profileSkillsKey, type ProfileSkillRow } from "@/lib/hooks/useProfileSkills";
import { skillsListKey, type SkillsQueryResult } from "@/lib/hooks/useSkillTable";

import { ProfileSkillForm, type ProfileSkillFormData } from "./ProfileSkillForm";

interface AddProfileSkillModalProps {
    open: boolean;
    userId: string;
    existingSkills: ProfileSkillRow[];
    editingSkill?: ProfileSkillRow | null;
    onOpenChange: (open: boolean) => void;
}

type MutationVars = { formData: ProfileSkillFormData; isEditing: boolean };

export function AddProfileSkillModal({
    open,
    userId,
    existingSkills,
    editingSkill,
    onOpenChange,
}: AddProfileSkillModalProps) {
    const tUser = useTranslations("User");
    const queryClient = useQueryClient();

    const { data } = useQuery<SkillsQueryResult>({
        queryKey: skillsListKey(),
        queryFn: () => gqlClient.request<SkillsQueryResult>(SKILLS_QUERY),
        enabled: open,
    });

    const availableSkills = (data?.skills ?? []).filter(
        (s) => !existingSkills.some((e) => e.name === s.name) || s.name === editingSkill?.name,
    );

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: ({ formData, isEditing }: MutationVars) => {
            const vars = { skill: { userId, name: formData.name, mastery: formData.mastery } };
            return isEditing
                ? gqlClient.request(UPDATE_PROFILE_SKILL_MUTATION, vars)
                : gqlClient.request(ADD_PROFILE_SKILL_MUTATION, vars);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: profileSkillsKey(userId) }),
        onClose: onOpenChange,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl"
                aria-describedby={undefined}
            >
                <DialogTitle>
                    {editingSkill ? tUser("edit_skill_title") : tUser("add_skill_title")}
                </DialogTitle>
                <ProfileSkillForm
                    availableSkills={availableSkills}
                    initialData={
                        editingSkill
                            ? { name: editingSkill.name, mastery: editingSkill.mastery }
                            : undefined
                    }
                    submitLabel={editingSkill ? tUser("save") : tUser("create")}
                    readOnly={!!editingSkill}
                    onSubmit={(formData) =>
                        handleMutate(
                            { formData, isEditing: !!editingSkill },
                            editingSkill ? tUser("edit_skill_error") : tUser("add_skill_error"),
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
