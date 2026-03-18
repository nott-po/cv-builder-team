"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { SimpleNameForm, type SimpleNameFormData } from "@/components/shared/SimpleNameForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { CREATE_DEPARTMENT_MUTATION } from "@/lib/graphql/operations/departments";
import { departmentsListKey } from "@/lib/hooks/useDepartmentTable";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

interface CreateDepartmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateDepartmentModal({ open, onOpenChange }: CreateDepartmentModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (data: SimpleNameFormData) =>
            gqlClient.request(CREATE_DEPARTMENT_MUTATION, {
                department: { name: data.name },
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: departmentsListKey() }),
        onClose: onOpenChange,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-full max-w-[calc(100vw-2rem)] sm:max-w-lg"
                aria-describedby={undefined}
            >
                <DialogTitle>{t("create_department_title")}</DialogTitle>
                <SimpleNameForm
                    submitLabel={t("create")}
                    onSubmit={(data) => handleMutate(data, t("create_department_error"))}
                    onCancel={() => handleOpenChange(false)}
                    isSubmitting={isPending}
                    error={submitError}
                />
            </DialogContent>
        </Dialog>
    );
}
