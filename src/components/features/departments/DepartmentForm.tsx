"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export type DepartmentFormData = {
    name: string;
};

type DepartmentFormProps = {
    submitLabel: string;
    initialData?: Partial<DepartmentFormData>;
    onSubmit: (data: DepartmentFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
    error: string | null;
};

export function DepartmentForm({
    submitLabel,
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
    error,
}: DepartmentFormProps) {
    const t = useTranslations("Admin");

    const schema = useMemo(
        () =>
            z.object({
                name: z.string().min(1, { message: t("name_required") }),
            }),
        [t],
    );

    const form = useForm<DepartmentFormData>({
        resolver: zodResolver(schema),
        defaultValues: { name: initialData?.name ?? "" },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                {error && <p className="text-destructive text-sm">{error}</p>}

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="transparent"
                        className="px-8 py-4"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        {t("cancel")}
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
