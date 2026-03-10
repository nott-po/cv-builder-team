"use client";

import { type ReactNode, useState } from "react";

import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

type Props = {
    children: ReactNode;
    locale: string;
    messages: Record<string, unknown>;
};

function SessionHydrator() {
    useCurrentUser();
    return null;
}

export function Providers({ children, locale, messages }: Props) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
                <QueryClientProvider client={queryClient}>
                    <SessionHydrator />
                    {children}
                </QueryClientProvider>
            </NextIntlClientProvider>
        </ThemeProvider>
    );
}
