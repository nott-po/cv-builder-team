import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ROUTES } from "@/lib/constants/routes";

export default async function NotFound() {
    const t = await getTranslations("Common");

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-title text-basic-text font-medium">{t("not_found")}</h1>
            <p className="text-body text-text-secondary">{t("not_found_description")}</p>
            <Link href={ROUTES.LOGIN}>
                <Button variant="redPrimary" size="redButton">
                    {t("go_home")}
                </Button>
            </Link>
        </div>
    );
}
