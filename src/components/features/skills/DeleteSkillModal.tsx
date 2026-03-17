"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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

    const handleConfirm = () => {
        if (!skill) return;
        handleMutate(skill.id, t("delete_skill_error"));
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-xl" aria-describedby={undefined}>
                <DialogTitle>{t("delete_skill_title")}</DialogTitle>
                <p className="text-muted-foreground text-sm">
                    {t("delete_skill_confirm")}{" "}
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
                        {t("cancel")}
                    </Button>
                    <Button
                        type="button"
                        variant="redPrimary"
                        className="px-8 py-4"
                        onClick={handleConfirm}
                        disabled={isPending}
                    >
                        {t("confirm")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
