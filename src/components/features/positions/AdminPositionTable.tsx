"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Plus } from "lucide-react";

import { DataTable } from "@/components/shared/DataTable";
import { NameOnlyTableSkeleton } from "@/components/shared/NameOnlyTableSkeleton";
import { RowActionsDropdown } from "@/components/shared/RowActionsDropdown";
import { Button } from "@/components/ui/button";
import { usePositionTable, type PositionRow } from "@/lib/hooks/usePositionTable";

import { CreatePositionModal } from "./CreatePositionModal";
import { DeletePositionModal } from "./DeletePositionModal";
import { EditPositionModal } from "./EditPositionModal";

export function AdminPositionTable() {
    const t = useTranslations("Admin");
    const { state, paginatedPositions } = usePositionTable();
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editPosition, setEditPosition] = useState<PositionRow | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletePosition, setDeletePosition] = useState<PositionRow | null>(null);

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

            <CreatePositionModal open={createOpen} onOpenChange={setCreateOpen} />
            <EditPositionModal open={editOpen} position={editPosition} onOpenChange={setEditOpen} />
            <DeletePositionModal
                open={deleteOpen}
                position={deletePosition}
                onOpenChange={setDeleteOpen}
            />
        </>
    );
}
