import { useTranslations } from "next-intl";

import { UserCVHeader } from "@/components/features/cvs/UserCVHeader";
import { PageHeader } from "@/components/shared/PageHeader";

export default function CvSkillsPage() {
    const t = useTranslations("CV");

    return (
        <div>
            <PageHeader items={[{ label: t("cvs") }]} />
            <div className="mb-4 px-6">
                <UserCVHeader mode="details" />
            </div>
        </div>
    );
}
