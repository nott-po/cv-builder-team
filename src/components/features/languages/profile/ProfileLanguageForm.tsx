"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    FloatingLabelWrapper,
    floatingSelectTriggerClass,
} from "@/components/ui/floating-label-wrapper";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Proficiency } from "@/generated/graphql";

const PROFICIENCY_OPTIONS = Object.values(Proficiency);

export type ProfileLanguageFormData = {
    name: string;
    proficiency: Proficiency;
};

type ProfileLanguageFormProps = {
    availableLanguages: { name: string }[];
    initialData?: Partial<ProfileLanguageFormData>;
    submitLabel: string;
    readOnly?: boolean;
    onSubmit: (data: ProfileLanguageFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
    error: string | null;
};

export function ProfileLanguageForm({
    availableLanguages,
    initialData,
    submitLabel,
    readOnly = false,
    onSubmit,
    onCancel,
    isSubmitting,
    error,
}: ProfileLanguageFormProps) {
    const tUser = useTranslations("User");
    const tCommon = useTranslations("Common");

    const profileLanguageSchema = useMemo(
        () =>
            z.object({
                name: z.string().min(1, { message: tUser("language_required") }),
                proficiency: z.enum(Proficiency, { message: tUser("proficiency_required") }),
            }),
        [tUser],
    );

    const form = useForm<ProfileLanguageFormData>({
        resolver: zodResolver(profileLanguageSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            proficiency: initialData?.proficiency ?? ("" as Proficiency),
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Language */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FloatingLabelWrapper
                                label={tUser("language")}
                                error={!!fieldState.error}
                            >
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isSubmitting || readOnly}
                                >
                                    <FormControl>
                                        <SelectTrigger className={floatingSelectTriggerClass}>
                                            <SelectValue placeholder={tUser("language")} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent
                                        side="bottom"
                                        avoidCollisions={false}
                                        className="max-h-48"
                                    >
                                        {availableLanguages.map((l) => (
                                            <SelectItem key={l.name} value={l.name}>
                                                {l.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FloatingLabelWrapper>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Proficiency */}
                <FormField
                    control={form.control}
                    name="proficiency"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FloatingLabelWrapper
                                label={tUser("language_proficiency")}
                                error={!!fieldState.error}
                            >
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isSubmitting}
                                >
                                    <FormControl>
                                        <SelectTrigger className={floatingSelectTriggerClass}>
                                            <SelectValue placeholder={tUser("proficiency")} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent side="bottom" avoidCollisions={false}>
                                        {PROFICIENCY_OPTIONS.map((p) => (
                                            <SelectItem key={p} value={p}>
                                                {p}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FloatingLabelWrapper>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {error && <p className="text-destructive text-sm">{error}</p>}

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="transparent"
                        className="px-8 py-4"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        {tCommon("cancel")}
                    </Button>
                    <Button
                        type="submit"
                        variant="redPrimary"
                        className="px-8 py-4"
                        disabled={isSubmitting}
                    >
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
