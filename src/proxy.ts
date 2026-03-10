import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import { unsealData } from "iron-session";

import { routing } from "@/i18n/routing";
import { isPublicPath, canAccess } from "@/lib/auth/permissions";
import { SESSION_OPTIONS } from "@/lib/auth/tokens";
import { ROLE_HOME } from "@/lib/constants/roles";
import type { SessionData } from "@/types/auth";

const intlMiddleware = createIntlMiddleware(routing);

const nonDefaultLocales = routing.locales.filter((l) => l !== routing.defaultLocale);
const localePattern = new RegExp(`^\\/(${nonDefaultLocales.join("|")})(?=\\/|$)`);

function getLocalePrefix(pathname: string): string {
    const match = localePattern.exec(pathname);
    return match ? match[0] : "";
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const localePrefix = getLocalePrefix(pathname);
    const pathnameWithoutLocale = localePrefix
        ? pathname.slice(localePrefix.length) || "/"
        : pathname;

    const cookieValue = request.cookies.get(SESSION_OPTIONS.cookieName)?.value;
    let session: SessionData = {};
    if (cookieValue) {
        try {
            session = await unsealData<SessionData>(cookieValue, {
                password: SESSION_OPTIONS.password as string,
            });
        } catch {}
    }

    if (cookieValue && !session.user) {
        const response = NextResponse.redirect(new URL(`${localePrefix}/login`, request.url));
        response.cookies.delete(SESSION_OPTIONS.cookieName);
        return response;
    }

    const isAuthenticated = Boolean(session.user?.id);
    const isPublic = isPublicPath(pathnameWithoutLocale);

    if (!isAuthenticated && !isPublic) {
        return NextResponse.redirect(new URL(`${localePrefix}/login`, request.url));
    }

    if (isAuthenticated && isPublic) {
        const home = ROLE_HOME[session.user!.role];
        return NextResponse.redirect(new URL(`${localePrefix}${home}`, request.url));
    }

    if (isAuthenticated && !canAccess(pathnameWithoutLocale, session.user!.role)) {
        const home = ROLE_HOME[session.user!.role];
        return NextResponse.redirect(new URL(`${localePrefix}${home}`, request.url));
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ["/((?!_next|_vercel|api|.*\\..*).*)"],
};
