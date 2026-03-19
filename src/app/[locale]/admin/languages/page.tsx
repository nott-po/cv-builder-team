import { getTranslations } from "next-intl/server";

import { AdminLanguageTable } from "@/components/features/languages/admin/AdminLanguageTable";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function AdminLanguagesPage() {
    const t = await getTranslations("Admin");

    return (
        <div>
            <PageHeader items={[{ label: t("languages") }]} />
            <AdminLanguageTable />
        </div>
    );
}
