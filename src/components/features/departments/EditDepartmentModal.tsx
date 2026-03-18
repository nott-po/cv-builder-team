"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { SimpleNameForm, type SimpleNameFormData } from "@/components/shared/SimpleNameForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { UPDATE_DEPARTMENT_MUTATION } from "@/lib/graphql/operations/departments";
import { departmentsListKey, type DepartmentRow } from "@/lib/hooks/useDepartmentTable";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

interface EditDepartmentModalProps {
    open: boolean;
    department: DepartmentRow | null;
    onOpenChange: (open: boolean) => void;
}

export function EditDepartmentModal({ open, department, onOpenChange }: EditDepartmentModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();
    const departmentId = department?.id;

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (data: SimpleNameFormData) => {
            if (!departmentId) return Promise.reject(new Error("No department selected"));
            return gqlClient.request(UPDATE_DEPARTMENT_MUTATION, {
                department: { departmentId, name: data.name },
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: departmentsListKey() }),
        onClose: onOpenChange,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-full max-w-[calc(100vw-2rem)] sm:max-w-lg"
                aria-describedby={undefined}
            >
                <DialogTitle>{t("edit_department_title")}</DialogTitle>
                {department && (
                    <SimpleNameForm
                        key={department.id}
                        submitLabel={t("save")}
                        initialData={{ name: department.name }}
                        onSubmit={(data) => handleMutate(data, t("edit_department_error"))}
                        onCancel={() => handleOpenChange(false)}
                        isSubmitting={isPending}
                        error={submitError}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
