import { Skeleton } from "@/components/ui/skeleton";

function SkeletonSkillGroup({ count }: { count: number }) {
    return (
        <div>
            <Skeleton className="mb-4 h-4 w-36" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
                {Array.from({ length: count }, (_, i) => (
                    <div key={i} className="flex items-center gap-3 px-2 py-2">
                        <Skeleton className="h-1.5 w-16 flex-shrink-0 rounded-sm" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ProfileSkillTableSkeleton() {
    return (
        <div className="space-y-8">
            <SkeletonSkillGroup count={3} />
            <SkeletonSkillGroup count={2} />
        </div>
    );
}
