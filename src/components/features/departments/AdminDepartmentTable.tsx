"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Plus } from "lucide-react";

import { DataTable } from "@/components/shared/DataTable";
import { NameOnlyTableSkeleton } from "@/components/shared/NameOnlyTableSkeleton";
import { RowActionsDropdown } from "@/components/shared/RowActionsDropdown";
import { Button } from "@/components/ui/button";
import { useDepartmentTable, type DepartmentRow } from "@/lib/hooks/useDepartmentTable";

import { CreateDepartmentModal } from "./CreateDepartmentModal";
import { DeleteDepartmentModal } from "./DeleteDepartmentModal";
import { EditDepartmentModal } from "./EditDepartmentModal";

export function AdminDepartmentTable() {
    const t = useTranslations("Admin");
    const { state, paginatedDepartments } = useDepartmentTable();
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editDepartment, setEditDepartment] = useState<DepartmentRow | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteDepartment, setDeleteDepartment] = useState<DepartmentRow | null>(null);

    return (
        <>
            <DataTable
                state={state}
                messages={{ empty: t("no_departments"), error: t("error") }}
                searchPlaceholder={t("name")}
                actions={
                    <Button variant="redText" onClick={() => setCreateOpen(true)}>
                        <Plus />
                        {t("create_department")}
                    </Button>
                }
                skeleton={<NameOnlyTableSkeleton rows={state.pageSize} />}
                colSpan={2}
                minWidth="320px"
                head={
                    <>
                        <th className="py-4 text-left">
                            <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                                {t("name")}
                            </span>
                        </th>

                        <th className="w-18" />
                    </>
                }
            >
                {paginatedDepartments.map((department) => (
                    <tr key={department.id} className="border-divider border-b transition-colors">
                        <td className="text-small text-basic-text tracking-standard px-4 py-4">
                            {department.name}
                        </td>

                        <td className="w-18 py-4">
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
                        </td>
                    </tr>
                ))}
            </DataTable>

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
