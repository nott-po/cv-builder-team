"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { DELETE_CV_MUTATION } from "@/lib/graphql/operations/cvs";
import { cvsListKey, type CvRow } from "@/lib/hooks/useCVTable";

interface DeleteCVModalProps {
    open: boolean;
    cv: CvRow | null;
    onOpenChange: (open: boolean) => void;
}

export function DeleteCVModal({ open, cv, onOpenChange }: DeleteCVModalProps) {
    const t = useTranslations("CV");
    const queryClient = useQueryClient();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (cvId: string) => gqlClient.request(DELETE_CV_MUTATION, { cv: { cvId } }),

        onSuccess: () => {
            if (cv?.user?.id) {
                queryClient.invalidateQueries({ queryKey: cvsListKey(cv.user.id) });
            }
            onOpenChange(false);
        },
    });

    const handleConfirm = async () => {
        if (!cv) return;
        setSubmitError(null);
        try {
            await mutateAsync(cv.id);
        } catch {
            setSubmitError(t("delete_cv_error"));
        }
    };

    const handleOpenChange = (value: boolean) => {
        if (!isPending) {
            setSubmitError(null);
            onOpenChange(value);
        }
    };

    const cvName = cv ? cv.name : "";

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
                <DialogTitle>{t("delete_cv")}</DialogTitle>
                <p className="text-muted-foreground text-sm">
                    {t("delete_cv_text")} <strong className="text-foreground">{cvName}</strong>?
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
