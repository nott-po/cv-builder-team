import { getTranslations } from "next-intl/server";

import { DepartmentTable } from "@/components/features/departments/DepartmentTable";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function AdminDepartmentsPage() {
    const t = await getTranslations("Admin");

    return (
        <div>
            <PageHeader title={t("departments")} />
            <DepartmentTable />
        </div>
    );
}
