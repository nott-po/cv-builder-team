"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Plus } from "lucide-react";

import { PositionTable } from "@/components/shared/PositionTable";
import { RowActionsDropdown } from "@/components/shared/RowActionsDropdown";
import { Button } from "@/components/ui/button";
import type { PositionRow } from "@/lib/hooks/usePositionTable";

import { CreatePositionModal } from "./CreatePositionModal";
import { DeletePositionModal } from "./DeletePositionModal";
import { EditPositionModal } from "./EditPositionModal";

export function AdminPositionTable() {
    const t = useTranslations("Admin");
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editPosition, setEditPosition] = useState<PositionRow | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletePosition, setDeletePosition] = useState<PositionRow | null>(null);

    const renderRowActions = (position: PositionRow) => (
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
    );

    return (
        <>
            <PositionTable
                renderRowActions={renderRowActions}
                actions={
                    <Button variant="redText" onClick={() => setCreateOpen(true)}>
                        <Plus />
                        {t("create_position")}
                    </Button>
                }
            />
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
