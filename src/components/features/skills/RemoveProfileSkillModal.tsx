"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
    const tUser = useTranslations("User");
    const queryClient = useQueryClient();

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (name: string) =>
            gqlClient.request(DELETE_PROFILE_SKILL_MUTATION, {
                skill: { userId, name: [name] },
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: profileSkillsKey(userId) }),
        onClose: onOpenChange,
    });

    const handleConfirm = () => {
        if (!skill) return;
        handleMutate(skill.name, tUser("remove_skill_error"));
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-xl" aria-describedby={undefined}>
                <DialogTitle>{tUser("remove_skill_title")}</DialogTitle>
                <p className="text-muted-foreground text-sm">
                    {tUser("remove_skill_confirm")}{" "}
                    <strong className="text-foreground">{skill?.name}</strong>?
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
                        {tUser("cancel")}
                    </Button>
                    <Button
                        type="button"
                        variant="redPrimary"
                        className="px-8 py-4"
                        onClick={handleConfirm}
                        disabled={isPending}
                    >
                        {tUser("confirm")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
