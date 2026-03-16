"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { DELETE_USER_MUTATION } from "@/lib/graphql/operations/employees";
import type { EmployeeRow } from "@/lib/hooks/useEmployeeTable";

interface DeleteUserModalProps {
    open: boolean;
    employee: EmployeeRow | null;
    onOpenChange: (open: boolean) => void;
}

export function DeleteUserModal({ open, employee, onOpenChange }: DeleteUserModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (userId: string) => gqlClient.request(DELETE_USER_MUTATION, { userId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees", "list"] });
            onOpenChange(false);
        },
    });

    const handleConfirm = async () => {
        if (!employee) return;
        setSubmitError(null);
        try {
            await mutateAsync(employee.id);
        } catch {
            setSubmitError(t("delete_user_error"));
        }
    };

    const handleOpenChange = (value: boolean) => {
        if (!isPending) {
            setSubmitError(null);
            onOpenChange(value);
        }
    };

    const fullName = employee
        ? [employee.profile.first_name, employee.profile.last_name].filter(Boolean).join(" ") ||
          employee.email
        : "";

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
                <DialogTitle>{t("delete_user_title")}</DialogTitle>
                <p className="text-muted-foreground text-sm">
                    {t("delete_user_confirm")}{" "}
                    <strong className="text-foreground">{fullName}</strong>?
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
