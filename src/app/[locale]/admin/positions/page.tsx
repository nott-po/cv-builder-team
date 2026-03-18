import { getTranslations } from "next-intl/server";

import { PositionTable } from "@/components/features/positions/PositionTable";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function AdminPositionsPage() {
    const t = await getTranslations("Admin");

    return (
        <div>
            <PageHeader title={t("positions")} />
            <PositionTable />
        </div>
    );
}
