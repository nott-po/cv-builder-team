import { getTranslations } from "next-intl/server";

import { AdminLanguageTable } from "@/components/features/languages/AdminLanguageTable";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function AdminLanguagesPage() {
    const t = await getTranslations("Admin");

    return (
        <div>
            <PageHeader title={t("languages")} />
            <AdminLanguageTable />
        </div>
    );
}
