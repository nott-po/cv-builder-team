"use client";

import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { EmployeeAvatar } from "@/components/shared/EmployeeAvatar";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUserData } from "@/lib/hooks/useUserData";

// 1. Создаем схему валидации для профиля
const profileSchema = z.object({
    first_name: z.string().min(1, "First name is required").optional().or(z.literal("")),
    last_name: z.string().min(1, "Last name is required").optional().or(z.literal("")),
    department_name: z.string().optional().or(z.literal("")),
    position_name: z.string().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function EmployeeProfile() {
    const t = useTranslations("User");
    const params = useParams();
    const employeeId = params?.id as string;

    const { data, isLoading, isError } = useUserData(employeeId);

    // 2. Инициализируем форму
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        // Свойство values автоматически заполнит форму, когда data загрузится!
        values: {
            first_name: data?.profile.first_name || "",
            last_name: data?.profile.last_name || "",
            department_name: data?.department_name || "",
            position_name: data?.position_name || "",
        },
    });

    // 3. Функция отправки формы (пока просто выводим в консоль)
    function onSubmit(values: ProfileFormValues) {
        console.log("Данные для отправки на сервер:", values);
        // Здесь потом добавим mutation для обновления профиля
    }

    if (isLoading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (isError || !data) {
        return <div className="p-8 text-center text-red-500">Error loading profile</div>;
    }

    return (
        <div className="max-w-2xl p-6">
            <div className="mb-8 flex items-center gap-6">
                <EmployeeAvatar
                    size="md"
                    avatar={data.profile.avatar}
                    initial={(data.profile.first_name?.[0] ?? data.email?.[0] ?? "?").toUpperCase()}
                />
                <div>
                    <h1 className="text-xl font-medium">
                        {data.profile.first_name} {data.profile.last_name}
                    </h1>
                    <p className="text-gray-500">{data.email}</p>
                    {/* Если created_at есть в вашем типе, раскомментируйте: */}
                    {/* <p className="text-sm text-gray-400">Created: {data.created_at}</p> */}
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("first_name")}</FormLabel>
                                    <FormControl>
                                        <Input variant="default" {...field} />
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
                                    <FormLabel>{t("last_name")}</FormLabel>
                                    <FormControl>
                                        <Input variant="default" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="department_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("department")}</FormLabel>
                                    <FormControl>
                                        <Input variant="default" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="position_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("position")}</FormLabel>
                                    <FormControl>
                                        <Input variant="default" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        Сохранить изменения
                    </Button>
                </form>
            </Form>
        </div>
    );
}
