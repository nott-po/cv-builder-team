"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
    const t = useTranslations("Common");

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-title text-basic-text font-medium">{t("error")}</h1>
            <p className="text-body text-text-secondary">{t("error_description")}</p>
            <Button variant="redPrimary" size="redButton" onClick={reset}>
                {t("try_again")}
            </Button>
        </div>
    );
}
