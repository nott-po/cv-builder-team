"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { EllipsisVertical, Pencil, Plus, Trash2 } from "lucide-react";

import { DepartmentTable } from "@/components/shared/DepartmentTable";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DepartmentRow } from "@/lib/hooks/useDepartmentTable";

import { CreateDepartmentModal } from "./CreateDepartmentModal";
import { DeleteDepartmentModal } from "./DeleteDepartmentModal";
import { EditDepartmentModal } from "./EditDepartmentModal";

export function AdminDepartmentTable() {
    const t = useTranslations("Admin");
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editDepartment, setEditDepartment] = useState<DepartmentRow | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteDepartment, setDeleteDepartment] = useState<DepartmentRow | null>(null);

    const renderRowActions = (department: DepartmentRow) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="hover:bg-hover-md ml-4 flex size-10 items-center justify-center rounded-full transition-colors"
                    aria-label={t("department_actions")}
                >
                    <EllipsisVertical className="text-text-hint size-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => {
                        setEditDepartment(department);
                        setEditOpen(true);
                    }}
                >
                    <Pencil />
                    {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                        setDeleteDepartment(department);
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
            <DepartmentTable
                renderRowActions={renderRowActions}
                actions={
                    <Button variant="redText" onClick={() => setCreateOpen(true)}>
                        <Plus />
                        {t("create_department")}
                    </Button>
                }
            />
            <CreateDepartmentModal open={createOpen} onOpenChange={setCreateOpen} />
            <EditDepartmentModal
                open={editOpen}
                department={editDepartment}
                onOpenChange={setEditOpen}
            />
            <DeleteDepartmentModal
                open={deleteOpen}
                department={deleteDepartment}
                onOpenChange={setDeleteOpen}
            />
        </>
    );
}
