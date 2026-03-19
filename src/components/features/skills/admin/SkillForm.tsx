"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { SkillCategorySelect, type FlatCategory } from "./SkillCategorySelect";

export type SkillFormData = {
    name: string;
    categoryId?: string;
};

type SkillFormProps = {
    submitLabel: string;
    initialData?: Partial<SkillFormData>;
    categories: FlatCategory[];
    onSubmit: (data: SkillFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
    error: string | null;
};

export function SkillForm({
    submitLabel,
    initialData,
    categories,
    onSubmit,
    onCancel,
    isSubmitting,
    error,
}: SkillFormProps) {
    const t = useTranslations("Admin");
    const tCommon = useTranslations("Common");

    const skillSchema = useMemo(
        () =>
            z.object({
                name: z.string().min(1, { message: t("name_required") }),
                categoryId: z.string().optional(),
            }),
        [t],
    );

    const form = useForm<SkillFormData>({
        resolver: zodResolver(skillSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            categoryId: initialData?.categoryId ?? "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                {/* Category */}
                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <SkillCategorySelect
                                categories={categories}
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                disabled={isSubmitting}
                                error={!!fieldState.error}
                            />
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
