"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Plus } from "lucide-react";

import { DepartmentTable } from "@/components/shared/DepartmentTable";
import { RowActionsDropdown } from "@/components/shared/RowActionsDropdown";
import { Button } from "@/components/ui/button";
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
        <RowActionsDropdown
            ariaLabel={t("department_actions")}
            onEdit={() => {
                setEditDepartment(department);
                setEditOpen(true);
            }}
            onDelete={() => {
                setDeleteDepartment(department);
                setDeleteOpen(true);
            }}
        />
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
