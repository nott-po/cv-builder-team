"use client";

import React, { useState } from "react";

import { useTranslations } from "next-intl";

import { EllipsisVertical, Plus } from "lucide-react";

import { CreateCVModal } from "@/components/features/cvs/CreateCVModal";
import { DeleteCVModal } from "@/components/features/cvs/DeleteCVModal";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useCvTable, type CvRow } from "@/lib/hooks/useCvTable";

export function CVTable() {
    const t = useTranslations("CV");
    const { user } = useCurrentUser();
    const [createOpen, setCreateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedCv, setSelectedCv] = useState<CvRow | null>(null);

    const currentUserId = user?.id as string;
    const { paginatedCvs, isLoading, search, handleSearchChange } = useCvTable(currentUserId);

    if (isLoading) return <div className="p-6">Loading...</div>;

    return (
        <div>
            <div className="flex h-14 items-center justify-between px-11">
                <SearchInput
                    value={search}
                    onChange={handleSearchChange}
                    placeholder={t("search")}
                />
                <Button variant="redText" onClick={() => setCreateOpen(true)}>
                    <Plus />
                    {t("create_cv")}
                </Button>
            </div>
            <div className="overflow-x-auto px-6">
                <table className="w-full min-w-[640px] border-collapse">
                    <thead>
                        <tr className="border-divider border-b">
                            <th className="py-4 pl-4 text-left">
                                <span className="text-small text-basic-text tracking-standard flex items-center gap-1 font-medium whitespace-nowrap">
                                    {t("name")}
                                </span>
                            </th>

                            <th className="px-4 py-4 text-left">
                                <span className="text-small text-basic-text tracking-standard font-medium whitespace-nowrap">
                                    {t("education")}
                                </span>
                            </th>

                            <th className="px-4 py-4 text-left">
                                <span className="text-small text-basic-text tracking-standard font-medium">
                                    {t("employee")}
                                </span>
                            </th>

                            <th className="w-14" />
                        </tr>
                    </thead>

                    {paginatedCvs.length === 0 ? (
                        <tbody>
                            <tr>
                                <td
                                    colSpan={4}
                                    className="text-body text-text-secondary py-16 text-center"
                                >
                                    No CVs
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        paginatedCvs.map((cv: CvRow) => (
                            <tbody
                                key={cv.id}
                                className="border-divider hover:bg-hover-xs group cursor-pointer border-b transition-colors"
                            >
                                <tr>
                                    <td className="text-small text-basic-text tracking-standard w-1/3 px-4 pt-5 pb-1 align-top font-medium">
                                        {cv.name}
                                    </td>

                                    <td className="text-small text-basic-text tracking-standard w-1/3 px-4 pt-5 pb-1 align-top">
                                        {cv.education ?? "—"}
                                    </td>

                                    <td className="text-small text-basic-text tracking-standard w-1/3 px-4 pt-5 pb-1 align-top">
                                        {cv.user?.email ?? "—"}
                                    </td>

                                    <td>
                                        <button
                                            className="hover:bg-hover-md ml-4 flex size-10 items-center justify-center rounded-full transition-colors"
                                            onClick={() => {
                                                setSelectedCv(cv);
                                                setDeleteOpen(true);
                                            }}
                                            aria-label="Employee actions"
                                        >
                                            <EllipsisVertical className="text-text-hint size-5" />
                                        </button>
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-text-secondary tracking-standard px-4 pt-2 pb-5 text-sm"
                                    >
                                        <p className="line-clamp-3">{cv.description}</p>
                                    </td>
                                </tr>
                            </tbody>
                        ))
                    )}
                </table>
            </div>

            <CreateCVModal open={createOpen} onOpenChange={setCreateOpen} />
            <DeleteCVModal open={deleteOpen} cv={selectedCv} onOpenChange={setDeleteOpen} />
        </div>
    );
}
