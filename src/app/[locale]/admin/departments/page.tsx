import { getTranslations } from "next-intl/server";

import { AdminDepartmentTable } from "@/components/features/departments/AdminDepartmentTable";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function AdminDepartmentsPage() {
    const t = await getTranslations("Admin");

    return (
        <div>
            <PageHeader items={[{ label: t("departments") }]} />
            <AdminDepartmentTable />
        </div>
    );
}
