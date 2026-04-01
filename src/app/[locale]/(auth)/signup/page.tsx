import { useTranslations } from "next-intl";

import { Header } from "@/components/features/auth/Header";
import { SignupForm } from "@/components/features/auth/SignupForm";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function SignupPage() {
    const t = useTranslations("Auth");

    return (
        <div className="h-screen overflow-hidden">
            <Header mode="signup" />
            <main className="flex h-full items-center justify-center">
                <div className="w-full max-w-140 p-5">
                    <div className="pb-8.75">
                        <h1 className="text-basic-text text-heading pb-6.5 text-center">
                            {t("please_sign_up")}
                        </h1>
                        <p className="text-basic-text text-center">{t("greeting")}</p>
                    </div>
                    <div className="pb-2">
                        <SignupForm />
                    </div>
                    <div className="flex w-full justify-center">
                        <Button asChild variant="transparent" size="redButton">
                            <Link className="text-light-gray" href="/login">
                                {t("have_an_account")}
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
