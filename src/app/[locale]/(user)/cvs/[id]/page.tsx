import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/PageHeader";

export default function CvEditPage() {
    const t = useTranslations("CV");

    return (
        <div>
            <PageHeader items={[{ label: t("cvs") }]} />
        </div>
    );
}
