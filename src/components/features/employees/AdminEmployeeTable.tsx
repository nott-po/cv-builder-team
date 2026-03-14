"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Plus } from "lucide-react";

import { EmployeeTable } from "@/components/shared/EmployeeTable";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

import { CreateUserModal } from "./CreateUserModal";

export function AdminEmployeeTable() {
    const t = useTranslations("Admin");
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <EmployeeTable
                basePath={ROUTES.ADMIN.EMPLOYEES}
                actions={
                    <Button variant="redText" onClick={() => setModalOpen(true)}>
                        <Plus />
                        {t("create_user")}
                    </Button>
                }
            />
            <CreateUserModal open={modalOpen} onOpenChange={setModalOpen} />
        </>
    );
}
