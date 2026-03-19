import { TablePaginationSkeleton } from "@/components/shared/TablePaginationSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/table";

function SkeletonRow() {
    return (
        <tr className="border-divider border-b">
            <td className="px-6 py-4">
                <Skeleton className="h-4 w-36" />
            </td>
            <td className="px-6 py-4">
                <Skeleton className="h-4 w-24" />
            </td>
            <td className="px-6 py-4">
                <Skeleton className="h-4 w-36" />
            </td>
            <td className="w-18 py-4">
                <Skeleton className="ml-4 size-10 rounded-full" />
            </td>
        </tr>
    );
}

export function SkillTableSkeleton({ rows = DEFAULT_PAGE_SIZE }: { rows?: number }) {
    return (
        <div>
            <div className="flex h-14 items-center justify-between px-6">
                <Skeleton className="h-9 w-64 rounded-md" />
            </div>

            <div className="px-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-divider border-b">
                            <th className="px-6 py-4">
                                <Skeleton className="h-4 w-16" />
                            </th>
                            <th className="px-6 py-4">
                                <Skeleton className="h-4 w-12" />
                            </th>
                            <th className="px-6 py-4">
                                <Skeleton className="h-4 w-20" />
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
