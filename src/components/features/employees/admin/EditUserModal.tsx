"use client";

import { useTranslations } from "next-intl";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ClientError } from "graphql-request";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gqlClient } from "@/lib/graphql/fetcher";
import { DEPARTMENTS_QUERY } from "@/lib/graphql/operations/departments";
import { UPDATE_PROFILE_MUTATION, UPDATE_USER_MUTATION } from "@/lib/graphql/operations/employees";
import { POSITIONS_QUERY } from "@/lib/graphql/operations/positions";
import { departmentsListKey, type DepartmentsQueryResult } from "@/lib/hooks/useDepartmentTable";
import { employeesListKey, type EmployeeRow } from "@/lib/hooks/useEmployeeTable";
import { useModalMutation } from "@/lib/hooks/useModalMutation";
import { positionsListKey, type PositionsQueryResult } from "@/lib/hooks/usePositionTable";

import { EmployeeForm, type CreateUserFormData } from "./EmployeeForm";

interface EditUserModalProps {
    open: boolean;
    employee: EmployeeRow | null;
    onOpenChange: (open: boolean) => void;
}

export function EditUserModal({ open, employee, onOpenChange }: EditUserModalProps) {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();

    const { data: departmentsData } = useQuery<DepartmentsQueryResult>({
        queryKey: departmentsListKey(),
        queryFn: () => gqlClient.request<DepartmentsQueryResult>(DEPARTMENTS_QUERY),
        enabled: open,
    });

    const { data: positionsData } = useQuery<PositionsQueryResult>({
        queryKey: positionsListKey(),
        queryFn: () => gqlClient.request<PositionsQueryResult>(POSITIONS_QUERY),
        enabled: open,
    });

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: employeesListKey() }),
        onClose: onOpenChange,
    });

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
                        onSubmit={(data) =>
                            handleMutate(data, (err) =>
                                err instanceof ClientError
                                    ? (err.response.errors?.[0]?.message ?? t("edit_user_error"))
                                    : t("edit_user_error"),
                            )
                        }
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
