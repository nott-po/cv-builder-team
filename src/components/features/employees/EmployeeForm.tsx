"use client";

import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/generated/graphql";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    departmentId: z.string().optional(),
    positionId: z.string().optional(),
    role: z.nativeEnum(UserRole),
});

export type CreateUserFormData = z.infer<typeof schema>;

interface Option {
    id: string;
    name: string;
}

interface EmployeeFormProps {
    onSubmit: (data: CreateUserFormData) => Promise<void>;
    onCancel: () => void;
    departments: Option[];
    positions: Option[];
    isSubmitting: boolean;
    error?: string | null;
}

const selectTriggerClass =
    "rounded-none border-border-input-default h-auto py-4 shadow-none focus:ring-0 text-input-default";

export function EmployeeForm({
    onSubmit,
    onCancel,
    departments,
    positions,
    isSubmitting,
    error,
}: EmployeeFormProps) {
    const t = useTranslations("Admin");

    const form = useForm<CreateUserFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            first_name: "",
            last_name: "",
            departmentId: undefined,
            positionId: undefined,
            role: UserRole.Employee,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                    <FormControl>
                                        <SelectTrigger className={selectTriggerClass}>
                                            <SelectValue placeholder={t("department")} />
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="positionId"
                        render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                    <FormControl>
                                        <SelectTrigger className={selectTriggerClass}>
                                            <SelectValue placeholder={t("position")} />
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="w-1/2 pr-2">
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <div className="border-border-input-default relative border">
                                    <span className="bg-background text-muted-foreground absolute -top-2.5 left-3 px-1 text-xs leading-none">
                                        {t("role")}
                                    </span>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="text-input-default h-auto border-0 px-3 py-4 shadow-none focus:ring-0">
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
                                </div>
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
                        disabled={isSubmitting}
                    >
                        {t("create")}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
