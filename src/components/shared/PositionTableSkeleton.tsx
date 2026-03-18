import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/table";

import { TablePaginationSkeleton } from "./TablePaginationSkeleton";

function SkeletonRow() {
    return (
        <tr className="border-divider border-b">
            <td className="px-4 py-4">
                <Skeleton className="h-4 w-40" />
            </td>
            <td className="w-18 py-4">
                <Skeleton className="ml-4 size-10 rounded-full" />
            </td>
        </tr>
    );
}

export function PositionTableSkeleton({ rows = DEFAULT_PAGE_SIZE }: { rows?: number }) {
    return (
        <div>
            <div className="flex h-14 items-center justify-between px-6">
                <Skeleton className="h-9 w-64 rounded-md" />
            </div>

            <div className="px-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-divider border-b">
                            <th className="px-4 py-4">
                                <Skeleton className="h-4 w-16" />
                            </th>
                            <th className="w-18" />
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: rows }, (_, i) => (
                            <SkeletonRow key={i} />
                        ))}
                    </tbody>
                </table>
            </div>

            <TablePaginationSkeleton />
        </div>
    );
}
