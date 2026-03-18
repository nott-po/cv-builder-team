import { getTranslations } from "next-intl/server";

import { ProfileSkillTable } from "@/components/features/skills/ProfileSkillTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { getSession } from "@/lib/auth/tokens";

export default async function SkillsPage() {
    const [session, tUser] = await Promise.all([getSession(), getTranslations("User")]);

    return (
        <div>
            <PageHeader items={[{ label: tUser("skills") }]} />
            <ProfileSkillTable userId={session.user!.id} />
        </div>
    );
}
