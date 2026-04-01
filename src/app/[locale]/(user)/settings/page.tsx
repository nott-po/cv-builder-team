import { getTranslations } from "next-intl/server";

import { SettingsForm } from "@/components/features/settings/SettingsForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function SettingsPage() {
    const t = await getTranslations("Settings");

    return (
        <div>
            <PageHeader items={[{ label: t("title") }]} />
            <SettingsForm />
        </div>
    );
}
