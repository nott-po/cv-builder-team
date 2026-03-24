"use client";

import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FloatingLabelWrapper, floatingInputClass } from "@/components/ui/floating-label-wrapper";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/lib/constants/roles";

const baseSchema = z.object({
    email: z.string(),
    password: z.string(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    departmentId: z.string().optional(),
    positionId: z.string().optional(),
    role: z.nativeEnum(UserRole),
});

const createSchema = baseSchema.extend({
    email: z.string().email(),
    password: z.string().min(6),
});

export type CreateUserFormData = z.infer<typeof createSchema>;

export interface EditInitialData {
    first_name?: string | null;
    last_name?: string | null;
    departmentId?: string | null;
    positionId?: string | null;
    role: UserRole;
}

interface Option {
    id: string;
    name: string;
}

interface EmployeeFormProps {
    mode?: "create" | "edit";
    onSubmit: (data: CreateUserFormData) => Promise<void>;
    onCancel: () => void;
    departments: Option[];
    positions: Option[];
    isSubmitting: boolean;
    error?: string | null;
    initialData?: EditInitialData;
}

export function EmployeeForm({
    mode = "create",
    onSubmit,
    onCancel,
    departments,
    positions,
    isSubmitting,
    error,
    initialData,
}: EmployeeFormProps) {
    const t = useTranslations("Admin");
    const tCommon = useTranslations("Common");
    const isEdit = mode === "edit";

    const form = useForm<CreateUserFormData>({
        resolver: zodResolver(isEdit ? baseSchema : createSchema),
        defaultValues: {
            email: "",
            password: "",
            first_name: initialData?.first_name ?? "",
            last_name: initialData?.last_name ?? "",
            departmentId: initialData?.departmentId ?? undefined,
            positionId: initialData?.positionId ?? undefined,
            role: initialData?.role ?? UserRole.Employee,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {!isEdit && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            variant="default"
                                            size="default"
                                            type="email"
                                            placeholder={t("email")}
                                            autoComplete="off"
                                            disabled={isSubmitting}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            variant="default"
                                            size="default"
                                            type="password"
                                            placeholder={t("password")}
                                            autoComplete="new-password"
                                            disabled={isSubmitting}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        variant="default"
                                        size="default"
                                        placeholder={t("first_name")}
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        variant="default"
                                        size="default"
                                        placeholder={t("last_name")}
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="departmentId"
                        render={({ field }) => (
                            <FormItem>
                                <FloatingLabelWrapper label={t("department")}>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ?? ""}
                                        disabled={isSubmitting}
                                    >
                                        <FormControl>
                                            <SelectTrigger className={floatingInputClass}>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent
                                            side="bottom"
                                            avoidCollisions={false}
                                            className="max-h-48"
                                        >
                                            {departments.map((d) => (
                                                <SelectItem key={d.id} value={d.id}>
                                                    {d.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FloatingLabelWrapper>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="positionId"
                        render={({ field }) => (
                            <FormItem>
                                <FloatingLabelWrapper label={t("position")}>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ?? ""}
                                        disabled={isSubmitting}
                                    >
                                        <FormControl>
                                            <SelectTrigger className={floatingInputClass}>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent
                                            side="bottom"
                                            avoidCollisions={false}
                                            className="max-h-48"
                                        >
                                            {positions.map((p) => (
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

                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FloatingLabelWrapper label={t("role")}>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={isSubmitting}
                                    >
                                        <FormControl>
                                            <SelectTrigger className={floatingInputClass}>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent side="bottom" avoidCollisions={false}>
                                            {Object.values(UserRole).map((role) => (
                                                <SelectItem key={role} value={role}>
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FloatingLabelWrapper>
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
                        {isEdit ? t("save") : t("create")}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
