import { getTranslations } from "next-intl/server";

import { EmployeeTable } from "@/components/features/employees/EmployeeTable";

export default async function EmployeesPage() {
    const t = await getTranslations("User");

    return (
        <div>
            <div className="px-6 pt-4 pb-1">
                <h1 className="text-input-default tracking-standard px-5">
                    <span>{t("employees")}</span>
                </h1>
            </div>
            <EmployeeTable />
        </div>
    );
}
