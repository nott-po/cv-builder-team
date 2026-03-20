import { getTranslations } from "next-intl/server";

import { AdminProjectTable } from "@/components/features/projects/admin/AdminProjectTable";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function AdminProjectsPage() {
    const t = await getTranslations("Admin");

    return (
        <div>
            <PageHeader items={[{ label: t("projects") }]} />
            <AdminProjectTable />
        </div>
    );
}
