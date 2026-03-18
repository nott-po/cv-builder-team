"use client";

import { useState } from "react";

import { useSearchParams } from "next/navigation";

import { useRouter } from "@/i18n/routing";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/table";

export function useTablePagination(basePath: string) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [page, setPage] = useState(1);
    const pageSize = Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;

    function handlePageChange(newPage: number) {
        setPage(newPage);
    }

    function handlePageSizeChange(size: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("pageSize", String(size));
        router.push(`${basePath}?${params.toString()}`);
        setPage(1);
    }

    return { page, setPage, pageSize, handlePageChange, handlePageSizeChange };
}
