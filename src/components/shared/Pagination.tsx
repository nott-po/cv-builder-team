"use client";

import { useTranslations } from "next-intl";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Pagination as PaginationNav,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type PaginationProps = {
    page: number;
    totalPages: number;
    pageSize: number;
    pageSizeOptions: readonly number[];
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    rowsPerPageLabel: string;
    pageLabel: string;
};

export function Pagination({
    page,
    totalPages,
    pageSize,
    pageSizeOptions,
    onPageChange,
    onPageSizeChange,
    rowsPerPageLabel,
    pageLabel,
}: PaginationProps) {
    const t = useTranslations("Common");

    return (
        <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 px-6 py-3">
            <div className="flex items-center gap-2">
                <span className="text-small text-text-secondary tracking-standard whitespace-nowrap">
                    {rowsPerPageLabel}
                </span>
                <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
                    <SelectTrigger className="text-small h-8 w-18">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {pageSizeOptions.map((n) => (
                            <SelectItem key={n} value={String(n)}>
                                {n}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <span className="text-small text-text-secondary tracking-standard whitespace-nowrap">
                {pageLabel}
            </span>

            <PaginationNav className="mx-0 w-auto">
                <PaginationContent className="gap-1">
                    <PaginationItem>
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => onPageChange(1)}
                            disabled={page === 1}
                            aria-label={t("first_page")}
                        >
                            <ChevronsLeft className="size-4" />
                        </Button>
                    </PaginationItem>
                    <PaginationItem>
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1}
                            aria-label={t("previous_page")}
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                    </PaginationItem>
                    <PaginationItem>
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                            aria-label={t("next_page")}
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </PaginationItem>
                    <PaginationItem>
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => onPageChange(totalPages)}
                            disabled={page >= totalPages}
                            aria-label={t("last_page")}
                        >
                            <ChevronsRight className="size-4" />
                        </Button>
                    </PaginationItem>
                </PaginationContent>
            </PaginationNav>
        </div>
    );
}
