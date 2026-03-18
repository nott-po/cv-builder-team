"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
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
        <DeleteConfirmModal
            open={open}
            onOpenChange={handleOpenChange}
            title={t("delete_department_title")}
            description={
                <>
                    {t("delete_department_confirm")}{" "}
                    <strong className="text-foreground">{department?.name}</strong>?
                </>
            }
            onConfirm={() =>
                department && handleMutate(department.id, t("delete_department_error"))
            }
            isPending={isPending}
            error={submitError}
        />
    );
}
