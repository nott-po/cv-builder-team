import type {Metadata} from "next";
import {Inter} from "next/font/google";
import { getMessages } from "next-intl/server";
import "../globals.css";
import { Providers } from "../providers";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "CV Builder",
    description: "Curriculum Vitae Management Platform",
};

export default async function RootLayout({
                                           children,
                                           params,
                                         }: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
    const {locale} = await params;
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={inter.className}>
                <Providers locale={locale} messages={messages}>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
