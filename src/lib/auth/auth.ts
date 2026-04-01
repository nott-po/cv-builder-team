"use server";

import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

import { routing } from "@/i18n/routing";

import { getSession } from "./tokens";

export async function logout() {
    const session = await getSession();
    session.destroy();
    const locale = await getLocale();
    const loginPath = locale === routing.defaultLocale ? "/login" : `/${locale}/login`;
    redirect(loginPath);
}
