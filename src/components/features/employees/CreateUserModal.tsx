"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClientError } from "graphql-request";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { type CreateUserInput } from "@/generated/graphql";
import { gqlClient } from "@/lib/graphql/fetcher";
import {
    CREATE_USER_MUTATION,
    DEPARTMENTS_QUERY,
    POSITIONS_QUERY,
} from "@/lib/graphql/operations/employees";

import { EmployeeForm, type CreateUserFormData } from "./EmployeeForm";

interface DepartmentsResult {
    departments: { id: string; name: string }[];
}

interface PositionsResult {
    positions: { id: string; name: string }[];
}

interface CreateUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
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
        mutationFn: (user: CreateUserInput) =>
            gqlClient.request<{ createUser: { id: string; email: string } }>(CREATE_USER_MUTATION, {
                user,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees", "list"] });
            onOpenChange(false);
        },
    });

    const handleSubmit = async (data: CreateUserFormData) => {
        setSubmitError(null);
        try {
            await mutateAsync({
                auth: { email: data.email, password: data.password },
                cvsIds: [],
                departmentId: data.departmentId || "",
                positionId: data.positionId || "",
                profile: {
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                },
                role: data.role,
            });
        } catch (err) {
            if (err instanceof ClientError) {
                const raw = err.response.errors?.[0]?.message ?? "";
                const message =
                    raw.includes("duplicate key") || raw.includes("unique constraint")
                        ? t("create_user_email_taken")
                        : raw || t("create_user_error");
                setSubmitError(message);
            } else {
                setSubmitError(t("create_user_error"));
            }
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
