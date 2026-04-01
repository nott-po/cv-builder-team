import { getTranslations } from "next-intl/server";

import { AdminSkillTable } from "@/components/features/skills/admin/AdminSkillTable";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function AdminSkillsPage() {
    const t = await getTranslations("Admin");

    return (
        <div>
            <PageHeader items={[{ label: t("skills") }]} />
            <AdminSkillTable />
        </div>
    );
}
