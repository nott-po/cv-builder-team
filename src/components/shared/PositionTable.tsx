"use client";

import type React from "react";

import { useTranslations } from "next-intl";

import { DataTable } from "@/components/shared/DataTable";
import { PositionTableSkeleton } from "@/components/shared/PositionTableSkeleton";
import { usePositionTable, type PositionRow } from "@/lib/hooks/usePositionTable";

type PositionTableProps = {
    actions?: React.ReactNode;
    renderRowActions?: (position: PositionRow) => React.ReactNode;
};

export function PositionTable({ actions, renderRowActions }: PositionTableProps) {
    const t = useTranslations("Admin");
    const { state, paginatedPositions } = usePositionTable();

    return (
        <DataTable
            state={state}
            messages={{ empty: t("no_positions"), error: t("error") }}
            searchPlaceholder={t("name")}
            actions={actions}
            skeleton={<PositionTableSkeleton rows={state.pageSize} />}
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

                    <td className="w-18 py-4">{renderRowActions?.(position)}</td>
                </tr>
            ))}
        </DataTable>
    );
}
