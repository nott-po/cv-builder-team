import { getTranslations } from "next-intl/server";

import { SkillTable } from "@/components/features/skills/SkillTable";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function AdminSkillsPage() {
    const t = await getTranslations("Admin");

    return (
        <div>
            <PageHeader title={t("skills")} />
            <SkillTable />
        </div>
    );
}
