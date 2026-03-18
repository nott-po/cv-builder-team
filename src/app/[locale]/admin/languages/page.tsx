import { getTranslations } from "next-intl/server";

import { LanguageTable } from "@/components/features/languages/LanguageTable";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function AdminLanguagesPage() {
    const t = await getTranslations("Admin");

    return (
        <div>
            <PageHeader title={t("languages")} />
            <LanguageTable />
        </div>
    );
}
