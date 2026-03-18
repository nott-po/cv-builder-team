"use client";

import type React from "react";

import { useTranslations } from "next-intl";

import { DataTable } from "@/components/shared/DataTable";
import { LanguageTableSkeleton } from "@/components/shared/LanguageTableSkeleton";
import { useLanguageTable, type LanguageRow } from "@/lib/hooks/useLanguageTable";

type LanguageTableProps = {
    actions?: React.ReactNode;
    renderRowActions?: (language: LanguageRow) => React.ReactNode;
};

export function LanguageTable({ actions, renderRowActions }: LanguageTableProps) {
    const t = useTranslations("Admin");
    const { state, paginatedLanguages } = useLanguageTable();

    return (
        <DataTable
            state={state}
            messages={{ empty: t("no_languages"), error: t("error") }}
            searchPlaceholder={t("name")}
            actions={actions}
            skeleton={<LanguageTableSkeleton rows={state.pageSize} />}
            colSpan={4}
            minWidth="480px"
            head={
                <>
                    <th className="py-4 text-left">
                        <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                            {t("iso2")}
                        </span>
                    </th>

                    <th className="py-4 text-left">
                        <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                            {t("name")}
                        </span>
                    </th>

                    <th className="py-4 text-left">
                        <span className="text-small text-basic-text tracking-standard px-4 font-medium whitespace-nowrap">
                            {t("native_name")}
                        </span>
                    </th>

                    <th className="w-18" />
                </>
            }
        >
            {paginatedLanguages.map((language) => (
                <tr key={language.id} className="border-divider border-b transition-colors">
                    <td className="text-small text-basic-text tracking-standard px-4 py-4 font-mono uppercase">
                        {language.iso2}
                    </td>

                    <td className="text-small text-basic-text tracking-standard px-4 py-4">
                        {language.name}
                    </td>

                    <td className="text-small text-text-secondary tracking-standard px-4 py-4">
                        {language.native_name ?? "—"}
                    </td>

                    <td className="w-18 py-4">{renderRowActions?.(language)}</td>
                </tr>
            ))}
        </DataTable>
    );
}
