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
};

export function Pagination({
    page,
    totalPages,
    pageSize,
    pageSizeOptions,
    onPageChange,
    onPageSizeChange,
}: PaginationProps) {
    const t = useTranslations("User");

    return (
        <div className="border-divider flex items-center justify-end gap-6 border-t px-6 py-3">
            <div className="flex items-center gap-2">
                <span className="text-small text-text-secondary tracking-standard whitespace-nowrap">
                    {t("rows_per_page")}
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
                {t("page_of", { page, total: totalPages })}
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
                            aria-label="First page"
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
                            aria-label="Previous page"
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
                            aria-label="Next page"
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
                            aria-label="Last page"
                        >
                            <ChevronsRight className="size-4" />
                        </Button>
                    </PaginationItem>
                </PaginationContent>
            </PaginationNav>
        </div>
    );
}
