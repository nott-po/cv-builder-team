"use client";

import type React from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface DeleteConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: React.ReactNode;
    onConfirm: () => void;
    isPending: boolean;
    error: string | null;
}

export function DeleteConfirmModal({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
    isPending,
    error,
}: DeleteConfirmModalProps) {
    const t = useTranslations("Common");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl" aria-describedby={undefined}>
                <DialogTitle>{title}</DialogTitle>
                <p className="text-muted-foreground text-sm">{description}</p>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="transparent"
                        className="px-8 py-4"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        type="button"
                        variant="redPrimary"
                        className="px-8 py-4"
                        onClick={onConfirm}
                        disabled={isPending}
                    >
                        {t("confirm")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
