"use client";

import { useSyncExternalStore } from "react";

import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { FloatingLabelWrapper, floatingInputClass } from "@/components/ui/floating-label-wrapper";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LOCALE_LABELS, routing, usePathname, useRouter } from "@/i18n/routing";

const THEME_OPTIONS = ["system", "light", "dark"] as const;

export function SettingsForm() {
    const t = useTranslations("Settings");
    const { theme, setTheme } = useTheme();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );

    function handleLocaleChange(newLocale: string) {
        router.replace(pathname, { locale: newLocale });
    }

    if (!mounted) return null;

    return (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-6 pt-10">
            <FloatingLabelWrapper label={t("appearance")}>
                <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className={floatingInputClass}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="bottom" avoidCollisions={false}>
                        {THEME_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                                {t(`theme_${opt}`)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FloatingLabelWrapper>

            <FloatingLabelWrapper label={t("language")}>
                <Select value={locale} onValueChange={handleLocaleChange}>
                    <SelectTrigger className={floatingInputClass}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="bottom" avoidCollisions={false}>
                        {routing.locales.map((loc) => (
                            <SelectItem key={loc} value={loc}>
                                {LOCALE_LABELS[loc] ?? loc}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FloatingLabelWrapper>
        </div>
    );
}
