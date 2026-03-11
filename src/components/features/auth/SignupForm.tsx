"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
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

type SignupFormValues = {
    email: string;
    password: string;
    confirmPassword: string;
};

export const getSignupFormSchema = (t: (key: string) => string) => {
  return z
    .object({
      email: z.string().email({
        message: t("wrong_email"),
      }),
      password: z.string().min(6, {
        message: t("wrong_password"),
      }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwords_do_not_match"),
      path: ["confirmPassword"],
    });
};

export function SignupForm() {
    const t = useTranslations("Auth");
    const router = useRouter();
    const { setUser } = useCurrentUser();

    const formSchema = useMemo(() => getSignupFormSchema(t), [t]);

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: SignupFormValues) {
        try {
            const { data } = await apiClient.post<{ user: SessionUser }>("/auth/signup", {
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
                                        <Input
                                            size="default"
                                            variant="default"
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder={t("password")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="sr-only">
                                        {t("confirm_password")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            size="default"
                                            variant="default"
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder={t("confirm_password")}
                                            {...field}
                                        />
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
                            {form.formState.isSubmitting ? t("loading") : t("sign_up")}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
