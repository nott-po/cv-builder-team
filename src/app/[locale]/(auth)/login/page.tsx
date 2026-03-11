import { useTranslations } from "next-intl";

import { Header } from "@/components/features/auth/Header";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function LoginPage() {
    const t = useTranslations("Auth");

    return (
        <div className="h-screen overflow-hidden">
            <Header mode="login" />
            <main className="flex h-full items-center justify-center">
                <div className="w-full max-w-140 p-5">
                    <div className="pb-8.75">
                        <h1 className="text-basic-text text-heading pb-6.5 text-center">
                            {t("welcome_back")}
                        </h1>
                        <p className="text-basic-text text-center">{t("glad_to_see_you")}</p>
                    </div>
                    <div className="pb-2">
                        <LoginForm />
                    </div>
                    <div className="flex w-full justify-center">
                        <Button asChild variant="transparent" size="redButton">
                            <Link className="text-light-gray" href="/signup">
                                {t("create_an_account")}
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
