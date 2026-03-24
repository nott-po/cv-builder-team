"use client";

import { useTranslations } from "next-intl";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ClientError } from "graphql-request";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { type CreateUserInput } from "@/generated/graphql";
import { fetcher, gqlClient } from "@/lib/graphql/fetcher";
import { DEPARTMENTS_QUERY } from "@/lib/graphql/operations/departments";
import { CREATE_USER_MUTATION } from "@/lib/graphql/operations/employees";
import { POSITIONS_QUERY } from "@/lib/graphql/operations/positions";
import { departmentsListKey, type DepartmentsQueryResult } from "@/lib/hooks/useDepartmentTable";
import { employeesListKey } from "@/lib/hooks/useEmployeeTable";
import { useModalMutation } from "@/lib/hooks/useModalMutation";
import { positionsListKey, type PositionsQueryResult } from "@/lib/hooks/usePositionTable";

import { EmployeeForm, type CreateUserFormData } from "./EmployeeForm";

interface CreateUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();

    const { data: departmentsData } = useQuery<DepartmentsQueryResult>({
        queryKey: departmentsListKey(),
        queryFn: () => fetcher<DepartmentsQueryResult, Record<string, never>>(DEPARTMENTS_QUERY)(),
        enabled: open,
    });

    const { data: positionsData } = useQuery<PositionsQueryResult>({
        queryKey: positionsListKey(),
        queryFn: () => fetcher<PositionsQueryResult, Record<string, never>>(POSITIONS_QUERY)(),
        enabled: open,
    });

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn: (user: CreateUserInput) => gqlClient.request(CREATE_USER_MUTATION, { user }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: employeesListKey() }),
        onClose: onOpenChange,
    });

    const handleSubmit = async (data: CreateUserFormData) => {
        await handleMutate(
            {
                auth: { email: data.email, password: data.password },
                cvsIds: [],
                departmentId: data.departmentId || "",
                positionId: data.positionId || "",
                profile: {
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                },
                role: data.role,
            },
            (err) => {
                if (err instanceof ClientError) {
                    const raw = err.response.errors?.[0]?.message ?? "";
                    return raw.includes("duplicate key") || raw.includes("unique constraint")
                        ? t("create_user_email_taken")
                        : raw || t("create_user_error");
                }
                return t("create_user_error");
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-full max-w-[calc(100vw-2rem)] sm:max-w-4xl"
                aria-describedby={undefined}
            >
                <DialogTitle>{t("create_user_title")}</DialogTitle>
                <EmployeeForm
                    onSubmit={handleSubmit}
                    onCancel={() => handleOpenChange(false)}
                    departments={departmentsData?.departments ?? []}
                    positions={positionsData?.positions ?? []}
                    isSubmitting={isPending}
                    error={submitError}
                />
            </DialogContent>
        </Dialog>
    );
}
