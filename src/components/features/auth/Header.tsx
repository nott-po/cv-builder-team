import {Button} from "@/components/ui/button"
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

interface Props {
  mode: "login" | "signup"
}

export function Header({mode}: Props) {
  const t = useTranslations('Auth');

  return (
    <div className="w-full flex justify-center">
      <Button
        asChild
        variant={mode === 'login' ? 'redUnderline_active' : 'redUnderline_inactive'}
        size="headerButtons"
      >
        <Link href="/login">{t("log_in")}</Link>
      </Button>
      <Button
        asChild
        variant={mode === 'signup' ? 'redUnderline_active' : 'redUnderline_inactive'}
        size="headerButtons"
      >
        <Link href="/signup">{t("sign_up")}</Link>
      </Button>
    </div>
  );
}
