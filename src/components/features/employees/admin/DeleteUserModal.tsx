"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";

import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { gqlClient } from "@/lib/graphql/fetcher";
import { DELETE_USER_MUTATION } from "@/lib/graphql/operations/employees";
import { employeesListKey, type EmployeeRow } from "@/lib/hooks/useEmployeeTable";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

interface DeleteUserModalProps {
    open: boolean;
    employee: EmployeeRow | null;
    onOpenChange: (open: boolean) => void;
}

export function DeleteUserModal({ open, employee, onOpenChange }: DeleteUserModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (userId: string) => gqlClient.request(DELETE_USER_MUTATION, { userId }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: employeesListKey() }),
        onClose: onOpenChange,
    });

    const fullName = employee
        ? [employee.profile.first_name, employee.profile.last_name].filter(Boolean).join(" ") ||
          employee.email
        : "";

    return (
        <DeleteConfirmModal
            open={open}
            onOpenChange={handleOpenChange}
            title={t("delete_user_title")}
            description={
                <>
                    {t("delete_user_confirm")}{" "}
                    <strong className="text-foreground">{fullName}</strong>?
                </>
            }
            onConfirm={() => employee && handleMutate(employee.id, t("delete_user_error"))}
            isPending={isPending}
            error={submitError}
        />
    );
}
