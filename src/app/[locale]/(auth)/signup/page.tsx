import { LoginForm } from "@/components/features/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Header } from "@/components/features/auth/Header";
import Link from "next/link";

export default function SignupPage() {
    const t = useTranslations("Auth");

    return (
        <div className="h-screen overflow-hidden">
            <Header mode="signup" />
            <main className="flex h-full items-center justify-center">
                <div className="w-full max-w-140 p-5">
                    <div className="pb-8.75">
                        <h1 className="text-basic-text pb-6.5 text-center text-[34px]">
                            {t("please_sign_up")}
                        </h1>
                        <p className="text-basic-text text-center">{t("greeting")}</p>
                    </div>
                    <div className="pb-2">
                        <LoginForm />
                    </div>
                    <div className="flex w-full justify-center">
                        <Button asChild variant="transparent" size="redButton">
                            <Link className="text-light-gray" href="/forgot-password">
                                {t("have_an_account")}
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
