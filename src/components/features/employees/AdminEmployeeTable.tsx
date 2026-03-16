"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { EllipsisVertical, Pencil, Plus, Trash2 } from "lucide-react";

import { EmployeeTable } from "@/components/shared/EmployeeTable";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/lib/constants/routes";
import type { EmployeeRow } from "@/lib/hooks/useEmployeeTable";

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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="hover:bg-hover-md ml-4 flex size-10 items-center justify-center rounded-full transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Employee actions"
                >
                    <EllipsisVertical className="text-text-hint size-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        setEditEmployee(employee);
                        setEditOpen(true);
                    }}
                >
                    <Pencil />
                    {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => {
                        e.stopPropagation();
                        setDeleteEmployee(employee);
                        setDeleteOpen(true);
                    }}
                >
                    <Trash2 />
                    {t("delete")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
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
