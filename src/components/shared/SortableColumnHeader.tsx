import { ChevronDown, ChevronUp } from "lucide-react";

import type { SortDir } from "@/types/table";

type SortableColumnHeaderProps = {
    label: string;
    sortDir: SortDir;
    onToggle: () => void;
};

export function SortableColumnHeader({ label, sortDir, onToggle }: SortableColumnHeaderProps) {
    return (
        <th className="py-4 text-left">
            <button
                type="button"
                onClick={onToggle}
                className="text-small text-basic-text tracking-standard flex cursor-pointer items-center gap-1 px-4 font-medium transition-opacity hover:opacity-70"
            >
                {label}
                {sortDir === "asc" ? (
                    <ChevronUp className="size-4.5" />
                ) : (
                    <ChevronDown className="size-4.5" />
                )}
            </button>
        </th>
    );
}
