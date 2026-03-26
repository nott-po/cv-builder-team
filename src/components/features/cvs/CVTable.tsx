"use client";

import React, { useState } from "react";

import { useTranslations } from "next-intl";

import { ChevronDown, ChevronUp, EllipsisVertical, Plus } from "lucide-react";

import { CreateCVModal } from "@/components/features/cvs/CreateCVModal";
import { DeleteCVModal } from "@/components/features/cvs/DeleteCVModal";
import { CVTableSkeleton } from "@/components/shared/CVTableSkeleton";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useCVTable, type CvRow } from "@/lib/hooks/useCVTable";

export function CVTable() {
    const t = useTranslations("CV");
    const { user } = useCurrentUser();
    const [createOpen, setCreateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedCv, setSelectedCv] = useState<CvRow | null>(null);

    const isAdmin = user?.role === "Admin";

    const currentUserId = user?.id as string;
    const {
        paginatedCvs,
        isLoading,
        search,
        handleSearchChange,
        handleSortToggle,
        sortDir,
        handleRowClick,
    } = useCVTable(currentUserId, "/admin/cvs", isAdmin);

    const isDataLoading = isLoading || !user;

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
            {isDataLoading ? (
                <CVTableSkeleton rows={3} />
            ) : (
                <div className="overflow-x-auto px-6">
                    <table className="w-full min-w-[640px] border-collapse">
                        <thead>
                            <tr className="border-divider border-b">
                                <th className="px-4 py-4 text-left">
                                    <button
                                        onClick={handleSortToggle}
                                        className="text-small text-basic-text tracking-standard flex cursor-pointer items-center gap-1 font-medium transition-opacity hover:opacity-70"
                                    >
                                        <span className="text-small text-basic-text tracking-standard flex items-center gap-1 font-medium whitespace-nowrap">
                                            {t("name")}
                                        </span>
                                        {sortDir === "asc" ? (
                                            <ChevronUp className="size-4.5" />
                                        ) : (
                                            <ChevronDown className="size-4.5" />
                                        )}
                                    </button>
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
                                        {t("no_cvs")}
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            paginatedCvs.map((cv: CvRow) => (
                                <tbody
                                    key={cv.id}
                                    className="border-divider hover:bg-hover-xs group cursor-pointer border-b transition-colors"
                                    onClick={() => handleRowClick(cv.id)}
                                >
                                    <tr>
                                        <td className="text-small text-basic-text tracking-standard w-1/3 p-4 py-6 font-medium">
                                            {cv.name}
                                        </td>

                                        <td className="text-small text-basic-text tracking-standard w-1/3 p-4 py-6 font-medium">
                                            {cv.education ?? "—"}
                                        </td>

                                        <td className="text-small text-basic-text tracking-standard w-1/3 p-4 py-6 font-medium">
                                            {cv.user?.email ?? "—"}
                                        </td>

                                        <td className="text-small text-basic-text tracking-standard p-4">
                                            <button
                                                className="hover:bg-hover-md ml-4 flex size-10 items-center justify-center rounded-full transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
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
                                            className="text-text-secondary tracking-standard px-4 pb-5 text-sm"
                                        >
                                            <p className="line-clamp-3">{cv.description}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            ))
                        )}
                    </table>
                </div>
            )}

            <CreateCVModal open={createOpen} onOpenChange={setCreateOpen} />
            <DeleteCVModal open={deleteOpen} cv={selectedCv} onOpenChange={setDeleteOpen} />
        </div>
    );
}
