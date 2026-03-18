"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { DELETE_DEPARTMENT_MUTATION } from "@/lib/graphql/operations/departments";
import { departmentsListKey, type DepartmentRow } from "@/lib/hooks/useDepartmentTable";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

interface DeleteDepartmentModalProps {
    open: boolean;
    department: DepartmentRow | null;
    onOpenChange: (open: boolean) => void;
}

export function DeleteDepartmentModal({
    open,
    department,
    onOpenChange,
}: DeleteDepartmentModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (departmentId: string) =>
            gqlClient.request(DELETE_DEPARTMENT_MUTATION, { department: { departmentId } }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: departmentsListKey() }),
        onClose: onOpenChange,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-xl" aria-describedby={undefined}>
                <DialogTitle>{t("delete_department_title")}</DialogTitle>
                <p className="text-muted-foreground text-sm">
                    {t("delete_department_confirm")}{" "}
                    <strong className="text-foreground">{department?.name}</strong>?
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
                        onClick={() =>
                            department && handleMutate(department.id, t("delete_department_error"))
                        }
                        disabled={isPending}
                    >
                        {t("confirm")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
