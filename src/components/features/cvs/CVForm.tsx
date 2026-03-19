"use client";

import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const cvSchema = z.object({
    name: z.string().min(1, "Name is required"),
    education: z.string().optional(),
    description: z.string().min(1, "Description is required"),
});

export type CreateCvFormData = z.infer<typeof cvSchema>;

interface CvFormProps {
    onSubmit: (data: CreateCvFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
    error?: string | null;
}

export function CvForm({ onSubmit, onCancel, isSubmitting, error }: CvFormProps) {
    const t = useTranslations("CV");

    const form = useForm<CreateCvFormData>({
        resolver: zodResolver(cvSchema),
        defaultValues: {
            name: "",
            education: "",
            description: "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="relative">
                            <FormLabel className="bg-surface text-muted-foreground absolute -top-2.5 left-3 z-10 px-1 text-xs leading-none">
                                {t("name")}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    variant="default"
                                    size="default"
                                    className="relative z-0 text-base"
                                    autoComplete="off"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                        <FormItem className="relative">
                            <FormLabel className="bg-surface text-muted-foreground absolute -top-2.5 left-3 z-10 px-1 text-xs leading-none">
                                {t("education")}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    variant="default"
                                    size="default"
                                    className="relative z-0 text-base"
                                    autoComplete="off"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="relative">
                            <FormLabel className="bg-surface text-muted-foreground absolute -top-2.5 left-3 z-10 px-1 text-xs leading-none">
                                {t("description")}
                            </FormLabel>
                            <FormControl>
                                <textarea
                                    className={cn(
                                        "border-border-input-default text-input-default flex w-full rounded-none border bg-transparent px-3 py-4 text-base shadow-none transition-colors",
                                        "min-h-[160px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
                                        "relative z-0",
                                    )}
                                    autoComplete="off"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {error && <p className="text-destructive text-sm">{error}</p>}

                <div className="flex justify-end gap-3 pt-4">
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
                        variant="grayBg"
                        className="px-8 py-4"
                        disabled={isSubmitting}
                    >
                        {t("create")}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
