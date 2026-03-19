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
    CREATE_POSITION_MUTATION,
    DELETE_POSITION_MUTATION,
    UPDATE_POSITION_MUTATION,
} from "@/lib/graphql/operations/positions";
import { positionsListKey, usePositionTable, type PositionRow } from "@/lib/hooks/usePositionTable";

export function AdminPositionTable() {
    const t = useTranslations("Admin");
    const queryClient = useQueryClient();
    const { state, paginatedPositions } = usePositionTable();
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editPosition, setEditPosition] = useState<PositionRow | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletePosition, setDeletePosition] = useState<PositionRow | null>(null);

    const invalidate = () => queryClient.invalidateQueries({ queryKey: positionsListKey() });

    return (
        <>
            <DataTable
                state={state}
                messages={{ empty: t("no_positions"), error: t("error") }}
                searchPlaceholder={t("name")}
                actions={
                    <Button variant="redText" onClick={() => setCreateOpen(true)}>
                        <Plus />
                        {t("create_position")}
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
                {paginatedPositions.map((position) => (
                    <tr key={position.id} className="border-divider border-b transition-colors">
                        <td className="text-small text-basic-text tracking-standard px-4 py-4">
                            {position.name}
                        </td>

                        <td className="w-18 py-4">
                            <RowActionsDropdown
                                ariaLabel={t("position_actions")}
                                onEdit={() => {
                                    setEditPosition(position);
                                    setEditOpen(true);
                                }}
                                onDelete={() => {
                                    setDeletePosition(position);
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
                title={t("create_position_title")}
                errorMessage={t("create_position_error")}
                mutationFn={(data) =>
                    gqlClient.request(CREATE_POSITION_MUTATION, {
                        position: { name: data.name },
                    })
                }
                onSuccess={invalidate}
            />

            <AdminNameModal
                open={editOpen}
                onOpenChange={setEditOpen}
                title={t("edit_position_title")}
                errorMessage={t("edit_position_error")}
                entity={editPosition}
                mutationFn={(data) => {
                    if (!editPosition) return Promise.reject(new Error("No position selected"));
                    return gqlClient.request(UPDATE_POSITION_MUTATION, {
                        position: { positionId: editPosition.id, name: data.name },
                    });
                }}
                onSuccess={invalidate}
            />

            <AdminDeleteModal
                open={deleteOpen}
                item={deletePosition}
                onOpenChange={setDeleteOpen}
                mutation={DELETE_POSITION_MUTATION}
                buildVars={(id) => ({ position: { positionId: id } })}
                queryKey={positionsListKey()}
                titleKey="delete_position_title"
                confirmKey="delete_position_confirm"
                errorKey="delete_position_error"
            />
        </>
    );
}
