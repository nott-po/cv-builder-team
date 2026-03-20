"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { CVSkillTable } from "@/components/features/cvs/CVSkillTable";
import { UserCVHeader } from "@/components/features/cvs/UserCVHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { useCv } from "@/lib/hooks/useCV";

export default function CvSkillsPage() {
    const params = useParams();
    const cvId = params.id as string;
    const t = useTranslations("CV");
    const { cv } = useCv(cvId);

    if (!cv) return <div>loading</div>;

    return (
        <div>
            <PageHeader
                items={[
                    { label: t("cvs"), href: "/cvs" },
                    { label: cv.name, href: `/cvs/${cv.id}` },
                    { label: t("skills") },
                ]}
            />
            <div className="mb-4 px-6">
                <UserCVHeader mode="skills" />
            </div>

            <div>
                <CVSkillTable cvId={cvId} />
            </div>
        </div>
    );
}
