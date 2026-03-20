import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

interface Props {
    mode: "details" | "skills" | "projects" | "preview";
}

export function UserCVHeader({ mode }: Props) {
    const t = useTranslations("CV");

    return (
        <div className="w-full">
            <Button
                variant={mode === "details" ? "redUnderline_active" : "redUnderline_inactive"}
                size="headerButtons"
            >
                {t("details")}
            </Button>
            <Button
                variant={mode === "skills" ? "redUnderline_active" : "redUnderline_inactive"}
                size="headerButtons"
            >
                {t("skills")}
            </Button>
            <Button
                variant={mode === "projects" ? "redUnderline_active" : "redUnderline_inactive"}
                size="headerButtons"
            >
                {t("projects")}
            </Button>
            <Button
                variant={mode === "preview" ? "redUnderline_active" : "redUnderline_inactive"}
                size="headerButtons"
            >
                {t("preview")}
            </Button>
        </div>
    );
}
