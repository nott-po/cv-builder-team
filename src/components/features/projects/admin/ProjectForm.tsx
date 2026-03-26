"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import { FloatingLabelWrapper, floatingInputClass } from "@/components/ui/floating-label-wrapper";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { parseDateForInput } from "@/lib/utils/date";

import { EnvironmentSelect } from "./EnvironmentSelect";

function buildProjectSchema(t: (key: string) => string) {
    return z
        .object({
            name: z.string().min(1, { message: t("name_required") }),
            domain: z.string().min(1, { message: t("domain_required") }),
            start_date: z.string().min(1, { message: t("start_date_required") }),
            end_date: z
                .string()
                .optional()
                .transform((val) => val || undefined),
            description: z.string(),
            environment: z.array(z.string()),
        })
        .refine(
            (data) => {
                if (!data.end_date || !data.start_date) return true;
                return new Date(data.end_date) >= new Date(data.start_date);
            },
            { message: t("end_date_before_start"), path: ["end_date"] },
        );
}

export type ProjectFormData = z.output<ReturnType<typeof buildProjectSchema>>;

type ProjectFormProps = {
    submitLabel: string;
    initialData?: Partial<ProjectFormData>;
    onSubmit: (data: ProjectFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
    error: string | null;
};

export function ProjectForm({
    submitLabel,
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
    error,
}: ProjectFormProps) {
    const t = useTranslations("Admin");
    const tCommon = useTranslations("Common");

    const schema = useMemo(() => buildProjectSchema(t), [t]);

    const form = useForm<ProjectFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: initialData?.name ?? "",
            domain: initialData?.domain ?? "",
            start_date: parseDateForInput(initialData?.start_date),
            end_date: parseDateForInput(initialData?.end_date),
            description: initialData?.description ?? "",
            environment: initialData?.environment ?? [],
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                    {/* Domain */}
                    <FormField
                        control={form.control}
                        name="domain"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        variant={fieldState.error ? "error" : "default"}
                                        size="default"
                                        placeholder={t("domain")}
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Start Date */}
                    <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <DateInput
                                    label={t("start_date")}
                                    error={!!fieldState.error}
                                    disabled={isSubmitting}
                                    {...field}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* End Date */}
                    <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <DateInput
                                    label={t("end_date")}
                                    error={!!fieldState.error}
                                    disabled={isSubmitting}
                                    {...field}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FloatingLabelWrapper
                                label={t("description")}
                                error={!!fieldState.error}
                            >
                                <Textarea
                                    className={floatingInputClass}
                                    rows={5}
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            </FloatingLabelWrapper>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Environment */}
                <FormField
                    control={form.control}
                    name="environment"
                    render={({ field }) => (
                        <FormItem>
                            <EnvironmentSelect
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isSubmitting}
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
