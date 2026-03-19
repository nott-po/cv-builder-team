"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Plus } from "lucide-react";

import { RowActionsDropdown } from "@/components/shared/RowActionsDropdown";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import type { EmployeeRow } from "@/lib/hooks/useEmployeeTable";

import { EmployeeTable } from "../user/EmployeeTable";
import { CreateUserModal } from "./CreateUserModal";
import { DeleteUserModal } from "./DeleteUserModal";
import { EditUserModal } from "./EditUserModal";

export function AdminEmployeeTable() {
    const t = useTranslations("Admin");
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editEmployee, setEditEmployee] = useState<EmployeeRow | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteEmployee, setDeleteEmployee] = useState<EmployeeRow | null>(null);

    const renderRowActions = (employee: EmployeeRow) => (
        <RowActionsDropdown
            ariaLabel={t("employee_actions")}
            onEdit={() => {
                setEditEmployee(employee);
                setEditOpen(true);
            }}
            onDelete={() => {
                setDeleteEmployee(employee);
                setDeleteOpen(true);
            }}
        />
    );

    return (
        <>
            <EmployeeTable
                basePath={ROUTES.ADMIN.EMPLOYEES}
                renderRowActions={renderRowActions}
                actions={
                    <Button variant="redText" onClick={() => setCreateOpen(true)}>
                        <Plus />
                        {t("create_user")}
                    </Button>
                }
            />
            <CreateUserModal open={createOpen} onOpenChange={setCreateOpen} />
            <EditUserModal open={editOpen} employee={editEmployee} onOpenChange={setEditOpen} />
            <DeleteUserModal
                open={deleteOpen}
                employee={deleteEmployee}
                onOpenChange={setDeleteOpen}
            />
        </>
    );
}
