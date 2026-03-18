import { getTranslations } from "next-intl/server";

import { ProfileLanguageTable } from "@/components/features/languages/ProfileLanguageTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { getSession } from "@/lib/auth/tokens";

export default async function LanguagesPage() {
    const [session, tUser] = await Promise.all([getSession(), getTranslations("User")]);

    return (
        <div>
            <PageHeader items={[{ label: tUser("languages") }]} />
            <ProfileLanguageTable userId={session.user!.id} />
        </div>
    );
}
