import { Skeleton } from "@/components/ui/skeleton";

export function TablePaginationSkeleton() {
    return (
        <div className="flex items-center justify-end gap-6 px-6 py-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded-md" />
            </div>
        </div>
    );
}
