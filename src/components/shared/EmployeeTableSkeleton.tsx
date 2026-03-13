import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_PAGE_SIZE } from "@/lib/hooks/useEmployeeTable";

function SkeletonRow() {
    return (
        <tr className="border-divider border-b">
            <td className="w-20 py-4 pl-4">
                <Skeleton className="size-10 rounded-full" />
            </td>
            <td className="px-4 py-4">
                <Skeleton className="h-4 w-24" />
            </td>
            <td className="px-4 py-4">
                <Skeleton className="h-4 w-24" />
            </td>
            <td className="px-4 py-4">
                <Skeleton className="h-4 w-40" />
            </td>
            <td className="px-4 py-4">
                <Skeleton className="h-4 w-28" />
            </td>
            <td className="px-4 py-4">
                <Skeleton className="h-4 w-28" />
            </td>
            <td className="w-18 py-4">
                <Skeleton className="ml-4 size-10 rounded-full" />
            </td>
        </tr>
    );
}

export function EmployeeTableSkeleton({ rows = DEFAULT_PAGE_SIZE }: { rows?: number }) {
    return (
        <div>
            <div className="flex h-14 items-center px-6">
                <Skeleton className="h-9 w-64 rounded-md" />
            </div>

            <div className="px-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-divider border-b">
                            <th className="w-20 py-4" />
                            <th className="px-4 py-4">
                                <Skeleton className="h-4 w-20" />
                            </th>
                            <th className="px-4 py-4">
                                <Skeleton className="h-4 w-20" />
                            </th>
                            <th className="px-4 py-4">
                                <Skeleton className="h-4 w-20" />
                            </th>
                            <th className="px-4 py-4">
                                <Skeleton className="h-4 w-24" />
                            </th>
                            <th className="px-4 py-4">
                                <Skeleton className="h-4 w-20" />
                            </th>
                            <th className="w-18" />
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: rows }, (_, i) => (
                            <SkeletonRow key={`skeleton-row-${i}`} />
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between px-6 py-4">
                <Skeleton className="h-4 w-32" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
            </div>
        </div>
    );
}
