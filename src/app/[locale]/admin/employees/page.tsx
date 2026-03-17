import { getTranslations } from "next-intl/server";

import { AdminEmployeeTable } from "@/components/features/employees/AdminEmployeeTable";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function AdminEmployeesPage() {
    const t = await getTranslations("Admin");

    return (
        <div>
            <PageHeader title={t("employees")} />
            <AdminEmployeeTable />
        </div>
    );
}
