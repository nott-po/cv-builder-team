"use client";

import React, { useState } from "react";

import { useTranslations } from "next-intl";

import { ChevronDown, ChevronUp, EllipsisVertical, Plus } from "lucide-react";

import { CreateCVModal } from "@/components/features/cvs/CreateCVModal";
import { DeleteCVModal } from "@/components/features/cvs/DeleteCVModal";
import { CVTableSkeleton } from "@/components/shared/CVTableSkeleton";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/constants/roles";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useCVTable, type CvRow } from "@/lib/hooks/useCVTable";

export function CVTable() {
    const t = useTranslations("CV");
    const { user } = useCurrentUser();
    const [createOpen, setCreateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedCv, setSelectedCv] = useState<CvRow | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const isAdmin = user?.role === UserRole.Admin;
    const currentUserId = user?.id as string;

    const {
        paginatedCvs,
        isLoading,
        isError,
        search,
        handleSearchChange,
        handleSortToggle,
        sortDir,
        handleRowClick,
        page,
        pageSize,
        totalPages,
        handlePageChange,
        handlePageSizeChange,
    } = useCVTable(currentUserId, `${isAdmin ? "/admin" : ""}/cvs`, isAdmin);

    const isDataLoading = isLoading || !user;

    const tableState = {
        isLoading: isDataLoading,
        isError: isError,
        search: search,
        onSearchChange: handleSearchChange,
        isEmpty: paginatedCvs.length === 0,
        page: page,
        totalPages: totalPages,
        pageSize: pageSize,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,
    };

    return (
        <div>
            <DataTable
                state={tableState}
                messages={{
                    empty: t("no_cvs"),
                    error: t("error_loading", { fallback: t("failed_to_load") }),
                }}
                searchPlaceholder={t("search")}
                skeleton={<CVTableSkeleton rows={3} />}
                colSpan={4}
                minWidth="640px"
                actions={
                    <Button variant="redText" onClick={() => setCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t("create_cv")}
                    </Button>
                }
                head={
                    <>
                        <th className="px-4 py-4 text-left">
                            <button
                                onClick={handleSortToggle}
                                className="text-small text-basic-text tracking-standard flex cursor-pointer items-center gap-1 font-medium transition-opacity hover:opacity-70"
                            >
                                <span className="whitespace-nowrap">{t("name")}</span>
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
                    </>
                }
            >
                {paginatedCvs.map((cv: CvRow) => {
                    const isHovered = hoveredId === cv.id;
                    const rowBaseClass = `group cursor-pointer transition-colors ${
                        isHovered ? "bg-hover-xs" : ""
                    }`;

                    return (
                        <React.Fragment key={cv.id}>
                            <tr
                                className={rowBaseClass}
                                onClick={() => handleRowClick(cv.id)}
                                onMouseEnter={() => setHoveredId(cv.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
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
                                    >
                                        <EllipsisVertical className="text-text-hint size-5" />
                                    </button>
                                </td>
                            </tr>
                            <tr
                                className={`border-divider border-b ${rowBaseClass}`}
                                onClick={() => handleRowClick(cv.id)}
                                onMouseEnter={() => setHoveredId(cv.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <td
                                    colSpan={4}
                                    className="text-text-secondary tracking-standard px-4 pb-5 text-sm"
                                >
                                    <p className="line-clamp-3">{cv.description}</p>
                                </td>
                            </tr>
                        </React.Fragment>
                    );
                })}
            </DataTable>

            <CreateCVModal open={createOpen} onOpenChange={setCreateOpen} />
            <DeleteCVModal open={deleteOpen} cv={selectedCv} onOpenChange={setDeleteOpen} />
        </div>
    );
}
