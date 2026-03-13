import { getTranslations } from "next-intl/server";

import { EmployeeTable } from "@/components/features/employees/EmployeeTable";

export default async function EmployeesPage() {
    const t = await getTranslations("User");

    return (
        <div>
            <div className="px-6 pt-3 pb-3">
                <h1 className="text-title text-basic-text tracking-standard font-medium">
                    {t("employees")}
                </h1>
            </div>
            <EmployeeTable />
        </div>
    );
}
