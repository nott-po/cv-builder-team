import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

interface Props {
    mode: "details" | "skills" | "projects" | "preview";
    isAdmin?: boolean;
}

export function UserCVHeader({ mode, isAdmin = false }: Props) {
    const t = useTranslations("CV");

    const params = useParams();
    const cvId = params.id as string;

    return (
        <div className="w-full">
            <Button
                asChild
                variant={mode === "details" ? "redUnderline_active" : "redUnderline_inactive"}
                size="headerButtons"
            >
                <Link href={`${isAdmin ? "/admin" : ""}/cvs/${cvId}`}>{t("details")}</Link>
            </Button>
            <Button
                asChild
                variant={mode === "skills" ? "redUnderline_active" : "redUnderline_inactive"}
                size="headerButtons"
            >
                <Link href={`${isAdmin ? "/admin" : ""}/cvs/${cvId}/skills`}>{t("skills")}</Link>
            </Button>
            <Button
                asChild
                variant={mode === "projects" ? "redUnderline_active" : "redUnderline_inactive"}
                size="headerButtons"
            >
                <Link href={`${isAdmin ? "/admin" : ""}/cvs/${cvId}/projects`}>
                    {t("projects")}
                </Link>
            </Button>
            <Button
                asChild
                variant={mode === "preview" ? "redUnderline_active" : "redUnderline_inactive"}
                size="headerButtons"
            >
                <Link href={`${isAdmin ? "/admin" : ""}/cvs/${cvId}/preview`}>{t("preview")}</Link>
            </Button>
        </div>
    );
}
