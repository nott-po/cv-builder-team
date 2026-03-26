"use client";

import { useForm, useWatch } from "react-hook-form";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import { FloatingLabelWrapper, floatingInputClass } from "@/components/ui/floating-label-wrapper";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export type AvailableProject = {
    id: string;
    name: string;
    domain: string;
    environment: string[];
};

export type CVProjectFormValues = {
    projectId: string;
    start_date: string;
    end_date?: string;
    roles: string;
    responsibilities: string;
};

interface CVProjectFormProps {
    mode: "add" | "edit";
    defaultValues: CVProjectFormValues;
    availableProjects: AvailableProject[];
    onSubmit: (data: CVProjectFormValues) => void;
    onCancel: () => void;
    isSubmitting: boolean;
    error: string | null;
}

export function CVProjectForm({
    mode,
    defaultValues,
    availableProjects,
    onSubmit,
    onCancel,
    isSubmitting,
    error,
}: CVProjectFormProps) {
    const t = useTranslations("CV");

    const cvProjectFormSchema = z.object({
        projectId: z.string().min(1, t("project_required")),
        start_date: z.string().min(1, t("start_date_required")),
        end_date: z.string().optional(),
        roles: z.string().min(1, t("role_required")),
        responsibilities: z.string().min(1, t("responsibilities_required")),
    });

    const form = useForm<CVProjectFormValues>({
        resolver: zodResolver(cvProjectFormSchema),
        defaultValues,
    });

    const selectedProjectId = useWatch({ control: form.control, name: "projectId" });
    const selectedProjectInfo = availableProjects.find((p) => p.id === selectedProjectId);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6 overflow-hidden pt-4"
            >
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="projectId"
                        render={({ field, fieldState }) => (
                            <FormItem className="flex w-full flex-col">
                                <FloatingLabelWrapper
                                    label={t("project")}
                                    error={!!fieldState.error}
                                    className="w-full"
                                >
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={mode === "edit" || isSubmitting}
                                    >
                                        <SelectTrigger
                                            className={`${floatingInputClass} h-14 w-full`}
                                        >
                                            <SelectValue placeholder={t("select_a_project")} />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-48 w-full">
                                            {availableProjects.map((p) => (
                                                <SelectItem key={p.id} value={p.id}>
                                                    {p.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FloatingLabelWrapper>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex w-full flex-col">
                        <FloatingLabelWrapper label={t("domain")} className="w-full">
                            <Input
                                value={selectedProjectInfo?.domain || ""}
                                disabled
                                className={`${floatingInputClass} bg-muted w-full cursor-not-allowed`}
                            />
                        </FloatingLabelWrapper>
                    </div>
                </div>

                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field, fieldState }) => (
                            <FormItem className="flex w-full flex-col">
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
                    <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field, fieldState }) => (
                            <FormItem className="flex w-full flex-col">
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

                <div className="w-full space-y-6 opacity-70">
                    <div className="flex w-full flex-col">
                        <FloatingLabelWrapper label={t("environment")} className="w-full">
                            <div
                                className={`${floatingInputClass} bg-muted flex h-auto min-h-14 w-full cursor-not-allowed flex-wrap items-center gap-2 px-3 py-2 opacity-70`}
                            >
                                {selectedProjectInfo?.environment &&
                                    selectedProjectInfo.environment.length > 0 &&
                                    selectedProjectInfo.environment.map((item) => (
                                        <span
                                            key={item}
                                            className="bg-secondary text-secondary-foreground inline-flex items-center rounded-sm border px-2 py-1 text-xs font-medium shadow-sm"
                                        >
                                            {item}
                                        </span>
                                    ))}
                            </div>
                        </FloatingLabelWrapper>
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="roles"
                    render={({ field, fieldState }) => (
                        <FormItem className="flex w-full flex-col">
                            <FloatingLabelWrapper
                                label={t("roles")}
                                error={!!fieldState.error}
                                className="w-full"
                            >
                                <Input
                                    className={`${floatingInputClass} w-full`}
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            </FloatingLabelWrapper>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="responsibilities"
                    render={({ field, fieldState }) => (
                        <FormItem className="flex w-full flex-col">
                            <FloatingLabelWrapper
                                label={t("responsibilities")}
                                error={!!fieldState.error}
                                className="w-full"
                            >
                                <Textarea
                                    className={`${floatingInputClass} w-full`}
                                    rows={3}
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            </FloatingLabelWrapper>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {error && <p className="text-destructive w-full text-sm break-words">{error}</p>}

                <div className="flex w-full items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="transparent"
                        size="redButton"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        type="submit"
                        variant="redPrimary"
                        size="redButton"
                        disabled={isSubmitting || !form.formState.isDirty}
                    >
                        {mode === "add" ? t("add") : t("update")}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
