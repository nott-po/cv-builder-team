import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/table";

function SkeletonRow() {
    return (
        <tbody className="border-divider border-b">
            <tr>
                <td className="text-small text-basic-text tracking-standard w-1/3 p-4 py-6 font-medium">
                    <Skeleton className="h-4 w-3/4" />
                </td>
                <td className="text-small text-basic-text tracking-standard w-1/3 p-4 py-6 font-medium">
                    <Skeleton className="h-4 w-1/2" />
                </td>
                <td className="text-small text-basic-text tracking-standard w-1/3 p-4 py-6 font-medium">
                    <Skeleton className="h-4 w-1/2" />
                </td>
                <td className="text-small text-basic-text tracking-standard p-4">
                    <Skeleton className="ml-auto size-8 rounded-full" />
                </td>
            </tr>

            <tr>
                <td colSpan={4} className="px-4 pt-2 pb-5">
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                        <Skeleton className="h-3 w-4/6" />
                    </div>
                </td>
            </tr>
        </tbody>
    );
}

export function CVTableSkeleton({ rows = DEFAULT_PAGE_SIZE }: { rows?: number }) {
    return (
        <div>
            <div className="overflow-x-auto px-6">
                <table className="w-full min-w-[640px] border-collapse">
                    <thead>
                        <tr className="border-divider border-b">
                            <th className="py-4 pl-4 text-left">
                                <Skeleton className="h-4 w-20" />
                            </th>
                            <th className="px-4 py-4 text-left">
                                <Skeleton className="h-4 w-24" />
                            </th>
                            <th className="px-4 py-4 text-left">
                                <Skeleton className="h-4 w-20" />
                            </th>
                            <th className="w-14" />
                        </tr>
                    </thead>
                    {Array.from({ length: rows }, (_, i) => (
                        <SkeletonRow key={i} />
                    ))}
                </table>
            </div>
        </div>
    );
}
