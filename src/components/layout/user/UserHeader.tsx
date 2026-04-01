import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

interface Props {
    mode: "profile" | "skills" | "language";
    onModeChange: (mode: "profile" | "skills" | "language") => void;
}

export function UserHeader({ mode, onModeChange }: Props) {
    const t = useTranslations("User");

    return (
        <div className="w-full">
            <Button
                variant={mode === "profile" ? "redUnderline_active" : "redUnderline_inactive"}
                size="headerButtons"
                onClick={() => onModeChange("profile")}
            >
                {t("profile")}
            </Button>
            <Button
                variant={mode === "skills" ? "redUnderline_active" : "redUnderline_inactive"}
                size="headerButtons"
                onClick={() => onModeChange("skills")}
            >
                {t("skills")}
            </Button>
            <Button
                variant={mode === "language" ? "redUnderline_active" : "redUnderline_inactive"}
                size="headerButtons"
                onClick={() => onModeChange("language")}
            >
                {t("languages")}
            </Button>
        </div>
    );
}
