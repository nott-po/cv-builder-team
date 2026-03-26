"use client";

import { useTranslations } from "next-intl";

import { useQuery } from "@tanstack/react-query";
import { ChevronDown, X } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FloatingLabelWrapper, floatingInputClass } from "@/components/ui/floating-label-wrapper";
import { STALE_TIME_REFERENCE } from "@/lib/constants/query";
import { gqlClient } from "@/lib/graphql/fetcher";
import { SKILLS_QUERY } from "@/lib/graphql/operations/skills";
import { skillsListKey } from "@/lib/hooks/useSkillTable";
import { cn } from "@/lib/utils";

type SkillsResult = {
    skills: { id: string; name: string }[];
};

interface EnvironmentSelectProps {
    value: string[];
    onChange: (value: string[]) => void;
    disabled?: boolean;
    error?: boolean;
}

export function EnvironmentSelect({ value, onChange, disabled, error }: EnvironmentSelectProps) {
    const t = useTranslations("Admin");

    const { data: skillsData } = useQuery<SkillsResult>({
        queryKey: skillsListKey(),
        queryFn: () => gqlClient.request<SkillsResult>(SKILLS_QUERY),
        staleTime: STALE_TIME_REFERENCE,
    });

    const availableOptions = (skillsData?.skills.map((s) => s.name) ?? []).filter(
        (name) => !value.includes(name),
    );

    function addItem(name: string) {
        onChange([...value, name]);
    }

    function removeItem(name: string) {
        onChange(value.filter((v) => v !== name));
    }

    return (
        <FloatingLabelWrapper label={t("environment")} error={error}>
            <div className="flex min-h-14 flex-wrap items-center gap-2 px-3 py-3">
                {value.map((item) => (
                    <span
                        key={item}
                        className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded px-2 py-1 text-xs"
                    >
                        {item}
                        {!disabled && (
                            <button
                                type="button"
                                onClick={() => removeItem(item)}
                                className="text-muted-foreground hover:text-foreground ml-0.5 transition-colors"
                                aria-label={t("remove_environment_item", { name: item })}
                            >
                                <X className="size-3" />
                            </button>
                        )}
                    </span>
                ))}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={disabled}>
                        <button
                            type="button"
                            className={cn(
                                floatingInputClass,
                                "flex h-auto items-center gap-1 border-0 px-1 py-0 text-sm shadow-none",
                                disabled && "cursor-not-allowed opacity-50",
                            )}
                        >
                            <span className="text-muted-foreground">{t("add_skill")}</span>
                            <ChevronDown className="text-muted-foreground size-4 opacity-50" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-60 overflow-y-auto">
                        {availableOptions.length > 0 ? (
                            availableOptions.map((opt) => (
                                <DropdownMenuItem key={opt} onSelect={() => addItem(opt)}>
                                    {opt}
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem disabled>{t("no_skills_available")}</DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </FloatingLabelWrapper>
    );
}
