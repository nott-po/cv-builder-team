"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export type LanguageFormData = {
    iso2: string;
    name: string;
    native_name: string;
};

type LanguageFormProps = {
    submitLabel: string;
    initialData?: Partial<LanguageFormData>;
    onSubmit: (data: LanguageFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
    error: string | null;
};

export function LanguageForm({
    submitLabel,
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
    error,
}: LanguageFormProps) {
    const t = useTranslations("Admin");
    const tCommon = useTranslations("Common");

    const languageSchema = useMemo(
        () =>
            z.object({
                iso2: z
                    .string()
                    .min(2, { message: t("iso2_invalid") })
                    .max(2, { message: t("iso2_invalid") }),
                name: z.string().min(1, { message: t("name_required") }),
                native_name: z.string().min(1, { message: t("native_name_required") }),
            }),
        [t],
    );

    const form = useForm<LanguageFormData>({
        resolver: zodResolver(languageSchema),
        defaultValues: {
            iso2: initialData?.iso2 ?? "",
            name: initialData?.name ?? "",
            native_name: initialData?.native_name ?? "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* ISO2 */}
                    <FormField
                        control={form.control}
                        name="iso2"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        variant={fieldState.error ? "error" : "default"}
                                        size="default"
                                        placeholder={t("iso2")}
                                        maxLength={2}
                                        className="uppercase"
                                        disabled={isSubmitting}
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(e.target.value.toUpperCase())
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        variant={fieldState.error ? "error" : "default"}
                                        size="default"
                                        placeholder={t("name")}
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Native Name */}
                    <FormField
                        control={form.control}
                        name="native_name"
                        render={({ field, fieldState }) => (
                            <FormItem className="sm:col-span-2">
                                <FormControl>
                                    <Input
                                        variant={fieldState.error ? "error" : "default"}
                                        size="default"
                                        placeholder={t("native_name")}
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

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
