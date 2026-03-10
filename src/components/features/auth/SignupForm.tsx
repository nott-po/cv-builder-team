"use client"

import {useMemo} from "react"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useTranslations} from "next-intl";

export function SignupForm() {
    const t = useTranslations('Auth');

    const formSchema = useMemo(() => {
        return z.object({
            email: z.string().email({
                message: t('wrong_email'),
            }),
            password: z.string().min(6, {
                message: t('wrong_password'),
            }),
        })
    }, [t])

    type FormValues = z.infer<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(values: FormValues) {
        console.log("Data:", values)
    }

    return (
        <div>
            <Form {...form}>
                <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-5 pb-15">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="sr-only">{t('email')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            size="default"
                                            variant="default"
                                            type="email"
                                            autoComplete="email"
                                            placeholder={t('email')}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="sr-only">{t('password')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            size="default"
                                            variant="default"
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder={t('password')}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                        />
                    </div>

                    <div className="w-full flex justify-center">
                        <Button
                            type="submit"
                            variant="redPrimary"
                            size="redButton"
                        >
                            {t('sign_up')}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
