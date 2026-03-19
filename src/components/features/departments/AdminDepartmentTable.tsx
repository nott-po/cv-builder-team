"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { AdminDeleteModal } from "@/components/shared/AdminDeleteModal";
import { AdminNameModal } from "@/components/shared/AdminNameModal";
import { DataTable } from "@/components/shared/DataTable";
import { NameOnlyTableSkeleton } from "@/components/shared/NameOnlyTableSkeleton";
import { RowActionsDropdown } from "@/components/shared/RowActionsDropdown";
import { Button } from "@/components/ui/button";
import { gqlClient } from "@/lib/graphql/fetcher";
import {
    CREATE_DEPARTMENT_MUTATION,
    DELETE_DEPARTMENT_MUTATION,
    UPDATE_DEPARTMENT_MUTATION,
} from "@/lib/graphql/operations/departments";
import {
    departmentsListKey,
    useDepartmentTable,
    type DepartmentRow,
} from "@/lib/hooks/useDepartmentTable";

export function AdminDepartmentTable() {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();
    const { state, paginatedDepartments } = useDepartmentTable();
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editDepartment, setEditDepartment] = useState<DepartmentRow | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteDepartment, setDeleteDepartment] = useState<DepartmentRow | null>(null);

    const invalidate = () => queryClient.invalidateQueries({ queryKey: departmentsListKey() });

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

            <AdminNameModal
                open={createOpen}
                onOpenChange={setCreateOpen}
                title={t("create_department_title")}
                errorMessage={t("create_department_error")}
                mutationFn={(data) =>
                    gqlClient.request(CREATE_DEPARTMENT_MUTATION, {
                        department: { name: data.name },
                    })
                }
                onSuccess={invalidate}
            />

            <AdminNameModal
                open={editOpen}
                onOpenChange={setEditOpen}
                title={t("edit_department_title")}
                errorMessage={t("edit_department_error")}
                entity={editDepartment}
                mutationFn={(data) => {
                    if (!editDepartment) return Promise.reject(new Error("No department selected"));
                    return gqlClient.request(UPDATE_DEPARTMENT_MUTATION, {
                        department: { departmentId: editDepartment.id, name: data.name },
                    });
                }}
                onSuccess={invalidate}
            />

            <AdminDeleteModal
                open={deleteOpen}
                item={deleteDepartment}
                onOpenChange={setDeleteOpen}
                mutation={DELETE_DEPARTMENT_MUTATION}
                buildVars={(id) => ({ department: { departmentId: id } })}
                queryKey={departmentsListKey()}
                titleKey="delete_department_title"
                confirmKey="delete_department_confirm"
                errorKey="delete_department_error"
            />
        </>
    );
}
