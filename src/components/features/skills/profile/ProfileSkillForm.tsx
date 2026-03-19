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
import { Mastery } from "@/generated/graphql";

const MASTERY_OPTIONS = Object.values(Mastery);

export type ProfileSkillFormData = {
    name: string;
    mastery: Mastery;
};

type ProfileSkillFormProps = {
    availableSkills: { name: string }[];
    initialData?: Partial<ProfileSkillFormData>;
    submitLabel: string;
    /** Lock the skill select — set true when editing an existing entry */
    readOnly?: boolean;
    onSubmit: (data: ProfileSkillFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
    error: string | null;
};

export function ProfileSkillForm({
    availableSkills,
    initialData,
    submitLabel,
    readOnly = false,
    onSubmit,
    onCancel,
    isSubmitting,
    error,
}: ProfileSkillFormProps) {
    const tUser = useTranslations("User");
    const tCommon = useTranslations("Common");

    const profileSkillSchema = useMemo(
        () =>
            z.object({
                name: z.string().min(1, { message: tUser("skill_required") }),
                mastery: z.enum(Mastery, { message: tUser("mastery_required") }),
            }),
        [tUser],
    );

    const form = useForm<ProfileSkillFormData>({
        resolver: zodResolver(profileSkillSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            mastery: initialData?.mastery ?? ("" as Mastery),
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Skill */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FloatingLabelWrapper label={tUser("skill")} error={!!fieldState.error}>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isSubmitting || readOnly}
                                >
                                    <FormControl>
                                        <SelectTrigger className={floatingSelectTriggerClass}>
                                            <SelectValue placeholder={tUser("skill")} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent
                                        side="bottom"
                                        avoidCollisions={false}
                                        className="max-h-48"
                                    >
                                        {availableSkills.map((s) => (
                                            <SelectItem key={s.name} value={s.name}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FloatingLabelWrapper>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Mastery */}
                <FormField
                    control={form.control}
                    name="mastery"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FloatingLabelWrapper
                                label={tUser("skill_mastery")}
                                error={!!fieldState.error}
                            >
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isSubmitting}
                                >
                                    <FormControl>
                                        <SelectTrigger className={floatingSelectTriggerClass}>
                                            <SelectValue placeholder={tUser("mastery")} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent side="bottom" avoidCollisions={false}>
                                        {MASTERY_OPTIONS.map((m) => (
                                            <SelectItem key={m} value={m}>
                                                {m}
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
