import { getTranslations } from "next-intl/server";

import { AdminPositionTable } from "@/components/features/positions/AdminPositionTable";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function AdminPositionsPage() {
    const t = await getTranslations("Admin");

    return (
        <div>
            <PageHeader title={t("positions")} />
            <AdminPositionTable />
        </div>
    );
}
