"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { CVSkillTable } from "@/components/features/cvs/CVSkillTable";
import { UserCVHeader } from "@/components/features/cvs/UserCVHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useCv } from "@/lib/hooks/useCV";

export default function CvSkillsPage() {
    const params = useParams();
    const cvId = params.id as string;
    const t = useTranslations("CV");
    const { cv, isLoading } = useCv(cvId);

    return (
        <div>
            {isLoading ? (
                <div className="flex justify-start gap-3 px-11 pt-3 pb-3">
                    <Skeleton className="mb-2 h-4 w-30" />
                    <Skeleton className="mb-2 h-4 w-50" />
                    <Skeleton className="mb-2 h-4 w-20" />
                </div>
            ) : (
                <PageHeader
                    items={[
                        { label: t("cvs"), href: "/admin/cvs" },
                        { label: cv?.name || "", href: `/admin/cvs/${cv?.id}` },
                        { label: t("skills") },
                    ]}
                />
            )}

            <div className="mb-4 px-6">
                <UserCVHeader mode="skills" isAdmin />
            </div>

            <div>
                <CVSkillTable cvId={cvId} />
            </div>
        </div>
    );
}
