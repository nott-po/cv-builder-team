import { getTranslations } from "next-intl/server";

import { EmployeeTable } from "@/components/features/employees/EmployeeTable";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function EmployeesPage() {
    const t = await getTranslations("User");

    return (
        <div>
            <PageHeader title={t("employees")} />
            <EmployeeTable />
        </div>
    );
}
