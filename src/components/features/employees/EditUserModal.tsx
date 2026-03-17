"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClientError } from "graphql-request";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import {
    DEPARTMENTS_QUERY,
    POSITIONS_QUERY,
    UPDATE_PROFILE_MUTATION,
    UPDATE_USER_MUTATION,
} from "@/lib/graphql/operations/employees";
import { employeesListKey, type EmployeeRow } from "@/lib/hooks/useEmployeeTable";

import { EmployeeForm, type CreateUserFormData } from "./EmployeeForm";

interface DepartmentsResult {
    departments: { id: string; name: string }[];
}

interface PositionsResult {
    positions: { id: string; name: string }[];
}

interface EditUserModalProps {
    open: boolean;
    employee: EmployeeRow | null;
    onOpenChange: (open: boolean) => void;
}

export function EditUserModal({ open, employee, onOpenChange }: EditUserModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { data: departmentsData } = useQuery({
        queryKey: ["departments"],
        queryFn: () => gqlClient.request<DepartmentsResult>(DEPARTMENTS_QUERY),
        enabled: open,
    });

    const { data: positionsData } = useQuery({
        queryKey: ["positions"],
        queryFn: () => gqlClient.request<PositionsResult>(POSITIONS_QUERY),
        enabled: open,
    });

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (data: CreateUserFormData) => {
            if (!employee) return;

            await gqlClient.request(UPDATE_USER_MUTATION, {
                user: {
                    userId: employee.id,
                    departmentId: data.departmentId || "",
                    positionId: data.positionId || "",
                    role: data.role,
                },
            });

            await gqlClient.request(UPDATE_PROFILE_MUTATION, {
                profile: {
                    userId: employee.id,
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: employeesListKey() });
            setSubmitError(null);
            onOpenChange(false);
        },
    });

    const handleSubmit = async (data: CreateUserFormData) => {
        setSubmitError(null);
        try {
            await mutateAsync(data);
        } catch (err) {
            const message =
                err instanceof ClientError
                    ? (err.response.errors?.[0]?.message ?? t("edit_user_error"))
                    : t("edit_user_error");
            setSubmitError(message);
        }
    };

    const handleOpenChange = (value: boolean) => {
        if (!isPending) {
            setSubmitError(null);
            onOpenChange(value);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-full max-w-[calc(100vw-2rem)] sm:max-w-4xl"
                aria-describedby={undefined}
            >
                <DialogTitle>{t("edit_user_title")}</DialogTitle>
                {employee && (
                    <EmployeeForm
                        mode="edit"
                        key={employee.id}
                        onSubmit={handleSubmit}
                        onCancel={() => handleOpenChange(false)}
                        departments={departmentsData?.departments ?? []}
                        positions={positionsData?.positions ?? []}
                        isSubmitting={isPending}
                        error={submitError}
                        initialData={{
                            first_name: employee.profile.first_name,
                            last_name: employee.profile.last_name,
                            departmentId: employee.department?.id,
                            positionId: employee.position?.id,
                            role: employee.role,
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
