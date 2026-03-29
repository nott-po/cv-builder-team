"use client";

import { useTranslations } from "next-intl";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
    ProfileSkillForm,
    type ProfileSkillFormData,
} from "@/components/features/skills/profile/ProfileSkillForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { type MASTERY_COLOR } from "@/lib/constants/proficiency";
import { gqlClient } from "@/lib/graphql/fetcher";
import { ADD_CV_SKILL_MUTATION, UPDATE_CV_SKILL_MUTATION } from "@/lib/graphql/operations/cvs";
import { SKILLS_QUERY } from "@/lib/graphql/operations/skills";
import { cvDetailKey } from "@/lib/hooks/useCV";
import { useModalMutation } from "@/lib/hooks/useModalMutation";
import { skillsListKey, type SkillsQueryResult } from "@/lib/hooks/useSkillTable";

type CvSkillRow = {
    name: string;
    mastery: keyof typeof MASTERY_COLOR;
};

interface AddCvSkillModalProps {
    open: boolean;
    cvId: string;
    existingSkills: CvSkillRow[];
    editingSkill?: CvSkillRow | null;
    onOpenChange: (open: boolean) => void;
}

type MutationVars = { formData: ProfileSkillFormData; isEditing: boolean };

export function AddCVSkillModal({
    open,
    cvId,
    existingSkills,
    editingSkill,
    onOpenChange,
}: AddCvSkillModalProps) {
    const t = useTranslations("CV");
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
            const vars = { skill: { cvId, name: formData.name, mastery: formData.mastery } };
            return isEditing
                ? gqlClient.request(UPDATE_CV_SKILL_MUTATION, vars)
                : gqlClient.request(ADD_CV_SKILL_MUTATION, vars);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: cvDetailKey(cvId) }),
        onClose: onOpenChange,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl"
                aria-describedby={undefined}
            >
                <DialogTitle>{editingSkill ? t("edit_skill_title") : t("add_skill")}</DialogTitle>

                <ProfileSkillForm
                    availableSkills={availableSkills}
                    initialData={
                        editingSkill
                            ? { name: editingSkill.name, mastery: editingSkill.mastery }
                            : undefined
                    }
                    submitLabel={editingSkill ? t("save") : t("create")}
                    readOnly={!!editingSkill}
                    onSubmit={(formData) =>
                        handleMutate(
                            { formData, isEditing: !!editingSkill },
                            editingSkill ? t("edit_skill_error") : t("add_skill_error"),
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
