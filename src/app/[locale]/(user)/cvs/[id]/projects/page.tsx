"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { CVProjectTable } from "@/components/features/cvs/CVProjectTable";
import { UserCVHeader } from "@/components/features/cvs/UserCVHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { useCv } from "@/lib/hooks/useCV";

export default function CvProjectsPage() {
    const params = useParams();
    const cvId = params.id as string;
    const t = useTranslations("CV");
    const { cv } = useCv(cvId);

    return (
        <div>
            <PageHeader items={[{ label: t("cvs"), href: "/cvs" }, { label: cv?.name }]} />

            <div className="mb-4 px-6">
                <UserCVHeader mode="projects" />
            </div>
            <CVProjectTable cvId={cvId} readOnly={false} />
        </div>
    );
}
