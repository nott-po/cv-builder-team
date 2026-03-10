"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
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

type SignupFormValues = {
    email: string;
    password: string;
    confirmPassword: string;
};

export function SignupForm() {
    const t = useTranslations("Auth");

    const formSchema = useMemo(() => {
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
    }, [t]);

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    function onSubmit(values: SignupFormValues) {
        console.log("Data:", values);
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
