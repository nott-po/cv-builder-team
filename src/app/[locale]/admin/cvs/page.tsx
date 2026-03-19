"use client";

import { useTranslations } from "next-intl";

import { CVTable } from "@/components/features/cvs/CVTable";
import { PageHeader } from "@/components/shared/PageHeader";

export default function AdminCvsPage() {
    const t = useTranslations("CV");

    return (
        <div>
            <PageHeader items={[{ label: t("cvs") }]} />
            <CVTable />
        </div>
    );
}
