"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import * as z from "zod";

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
import { useRouter } from "@/i18n/routing";
import apiClient from "@/lib/api/client";
import { ROLE_HOME } from "@/lib/constants/roles";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import type { SessionUser } from "@/types/auth";

type LoginFormValues = {
    email: string;
    password: string;
};

export function LoginForm() {
    const t = useTranslations("Auth");
    const router = useRouter();
    const { setUser } = useCurrentUser();
    const [showPassword, setShowPassword] = useState(false);

    const formSchema = useMemo(() => {
        return z.object({
            email: z.string().email({
                message: t("wrong_email"),
            }),
            password: z.string().min(6, {
                message: t("wrong_password"),
            }),
        });
    }, [t]);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginFormValues) {
        try {
            const { data } = await apiClient.post<{ user: SessionUser }>("/auth/login", {
                email: values.email,
                password: values.password,
            });
            setUser(data.user);
            router.push(ROLE_HOME[data.user.role]);
        } catch (err) {
            const message =
                isAxiosError(err) && err.response?.data?.error
                    ? err.response.data.error
                    : t("server_error");
            form.setError("root", { message });
        }
    }

    return (
        <div>
            <Form {...form}>
                <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-5 pb-15">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="sr-only">{t("email")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            size="default"
                                            variant="default"
                                            type="email"
                                            autoComplete="email"
                                            placeholder={t("email")}
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
                                    <FormLabel className="sr-only">{t("password")}</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                size="default"
                                                variant="default"
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="current-password"
                                                placeholder={t("password")}
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute top-1/2 right-5 h-8 w-8 -translate-y-1/2 p-0 hover:bg-transparent [&_svg]:size-6"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="text-password-eye" />
                                                ) : (
                                                    <Eye className="text-password-eye" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {form.formState.errors.root && (
                        <p className="text-destructive pb-4 text-center text-sm">
                            {form.formState.errors.root.message}
                        </p>
                    )}

                    <div className="flex w-full justify-center">
                        <Button
                            type="submit"
                            variant="redPrimary"
                            size="redButton"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? t("loading") : t("log_in")}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
