"use client";

import { useTranslations } from "next-intl";

import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RowActionsDropdownProps {
    onEdit: () => void;
    onDelete: () => void;
    ariaLabel?: string;
}

export function RowActionsDropdown({ onEdit, onDelete, ariaLabel }: RowActionsDropdownProps) {
    const t = useTranslations("Common");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="hover:bg-hover-md flex size-10 items-center justify-center rounded-full transition-colors"
                    aria-label={ariaLabel ?? "Row actions"}
                    onClick={(e) => e.stopPropagation()}
                >
                    <EllipsisVertical className="text-text-hint size-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                >
                    <Pencil />
                    {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                >
                    <Trash2 />
                    {t("delete")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
