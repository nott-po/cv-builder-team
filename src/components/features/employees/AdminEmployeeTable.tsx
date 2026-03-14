"use client";

import { useTranslations } from "next-intl";

import { Plus } from "lucide-react";

import { EmployeeTable } from "@/components/shared/EmployeeTable";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

export function AdminEmployeeTable() {
    const t = useTranslations("Admin");

    return (
        <EmployeeTable
            basePath={ROUTES.ADMIN.EMPLOYEES}
            actions={
                <Button variant="redText">
                    <Plus />
                    {t("create_user")}
                </Button>
            }
        />
    );
}
