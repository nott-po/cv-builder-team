import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE_DEFAULT = 10;

function SkeletonRow() {
    return (
        <tr className="border-divider border-b">
            {/* Avatar */}
            <td className="w-20 py-4 pl-4">
                <Skeleton className="size-10 rounded-full" />
            </td>
            {/* First name */}
            <td className="px-4 py-4">
                <Skeleton className="h-4 w-24" />
            </td>
            {/* Last name */}
            <td className="px-4 py-4">
                <Skeleton className="h-4 w-24" />
            </td>
            {/* Email */}
            <td className="px-4 py-4">
                <Skeleton className="h-4 w-40" />
            </td>
            {/* Department */}
            <td className="px-4 py-4">
                <Skeleton className="h-4 w-28" />
            </td>
            {/* Position */}
            <td className="px-4 py-4">
                <Skeleton className="h-4 w-28" />
            </td>
            {/* Chevron */}
            <td className="w-18 py-4">
                <Skeleton className="ml-4 size-10 rounded-full" />
            </td>
        </tr>
    );
}

export function EmployeeTableSkeleton({ rows = PAGE_SIZE_DEFAULT }: { rows?: number }) {
    return (
        <div>
            {/* Search bar placeholder */}
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
                            <SkeletonRow key={i} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination placeholder */}
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
