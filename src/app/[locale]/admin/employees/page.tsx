import { getTranslations } from "next-intl/server";

import { AdminEmployeeTable } from "@/components/features/employees/AdminEmployeeTable";

export default async function AdminEmployeesPage() {
    const t = await getTranslations("Admin");

    return (
        <div>
            <div className="px-6 pt-3 pb-3">
                <h1 className="text-title text-basic-text tracking-standard font-medium">
                    {t("employees")}
                </h1>
            </div>
            <AdminEmployeeTable />
        </div>
    );
}
