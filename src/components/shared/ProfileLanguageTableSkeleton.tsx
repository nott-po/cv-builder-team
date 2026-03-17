import { Skeleton } from "@/components/ui/skeleton";

function SkeletonRow() {
    return (
        <tr className="border-divider border-b">
            <td className="px-6 py-4">
                <Skeleton className="h-4 w-10" />
            </td>
            <td className="px-6 py-4">
                <Skeleton className="h-4 w-28" />
            </td>
            <td className="w-18 py-4" />
        </tr>
    );
}

export function ProfileLanguageTableSkeleton({ rows = 3 }: { rows?: number }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] border-collapse">
                <tbody>
                    {Array.from({ length: rows }, (_, i) => (
                        <SkeletonRow key={i} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
