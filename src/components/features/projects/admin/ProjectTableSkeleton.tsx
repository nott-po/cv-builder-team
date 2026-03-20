import { TablePaginationSkeleton } from "@/components/shared/TablePaginationSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/table";

function SkeletonRow() {
    return (
        <>
            <tr>
                <td className="px-4 pt-4 pb-1">
                    <Skeleton className="h-4 w-40" />
                </td>
                <td className="px-4 pt-4 pb-1">
                    <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-4 pt-4 pb-1">
                    <Skeleton className="h-4 w-20" />
                </td>
                <td className="px-4 pt-4 pb-1">
                    <Skeleton className="h-4 w-20" />
                </td>
                <td className="w-18 pt-4 pb-1">
                    <Skeleton className="ml-4 size-10 rounded-full" />
                </td>
            </tr>
            <tr className="border-divider border-b">
                <td colSpan={5} className="px-4 pb-4">
                    <Skeleton className="mb-2 h-4 w-full" />
                    <Skeleton className="mb-3 h-4 w-3/4" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-5 w-14 rounded-md" />
                        <Skeleton className="h-5 w-16 rounded-md" />
                        <Skeleton className="h-5 w-12 rounded-md" />
                        <Skeleton className="h-5 w-16 rounded-md" />
                    </div>
                </td>
            </tr>
        </>
    );
}

export function ProjectTableSkeleton({ rows = DEFAULT_PAGE_SIZE }: { rows?: number }) {
    return (
        <div>
            <div className="flex h-14 items-center justify-between px-6">
                <Skeleton className="h-9 w-64 rounded-md" />
            </div>

            <div className="overflow-x-auto px-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-divider border-b">
                            <th className="px-4 py-4">
                                <Skeleton className="h-4 w-20" />
                            </th>
                            <th className="px-4 py-4">
                                <Skeleton className="h-4 w-16" />
                            </th>
                            <th className="px-4 py-4">
                                <Skeleton className="h-4 w-20" />
                            </th>
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
