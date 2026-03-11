import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import { sealData, unsealData } from "iron-session";

import { routing } from "@/i18n/routing";
import { isPublicPath, canAccess } from "@/lib/auth/permissions";
import { SESSION_OPTIONS } from "@/lib/auth/tokens";
import { ROLE_HOME } from "@/lib/constants/roles";
import type { SessionData } from "@/types/auth";

const intlMiddleware = createIntlMiddleware(routing);

const nonDefaultLocales = routing.locales.filter((l) => l !== routing.defaultLocale);
const localePattern = new RegExp(`^\\/(${nonDefaultLocales.join("|")})(?=\\/|$)`);

const GRAPHQL_URL = process.env.GRAPHQL_URL ?? "http://localhost:3001/api/graphql";
const REFRESH_MUTATION = "mutation UpdateToken { updateToken { access_token refresh_token } }";

const REFRESH_BUFFER_SECONDS = 60;

function getLocalePrefix(pathname: string): string {
    const match = localePattern.exec(pathname);
    return match ? match[0] : "";
}

function getTokenExpiry(token: string): number | null {
    try {
        const payloadB64 = token.split(".")[1];
        if (!payloadB64) return null;
        const base64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
        const payload = JSON.parse(atob(padded)) as { exp?: unknown };
        return typeof payload.exp === "number" ? payload.exp : null;
    } catch {
        return null;
    }
}

function isTokenExpired(token: string): boolean {
    const exp = getTokenExpiry(token);
    if (exp === null) return true;
    return Date.now() / 1000 >= exp - REFRESH_BUFFER_SECONDS;
}

async function callRefresh(
    refreshToken: string,
): Promise<{ access_token: string; refresh_token: string } | null> {
    try {
        const res = await fetch(GRAPHQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${refreshToken}`,
            },
            body: JSON.stringify({ query: REFRESH_MUTATION }),
        });
        const json = (await res.json()) as {
            data?: { updateToken?: { access_token: string; refresh_token: string } };
        };
        const tokens = json?.data?.updateToken;
        return tokens?.access_token && tokens?.refresh_token ? tokens : null;
    } catch {
        return null;
    }
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

    let tokensRefreshed = false;
    if (
        session.user &&
        session.accessToken &&
        session.refreshToken &&
        isTokenExpired(session.accessToken)
    ) {
        const newTokens = await callRefresh(session.refreshToken);
        if (newTokens) {
            session.accessToken = newTokens.access_token;
            session.refreshToken = newTokens.refresh_token;
            tokensRefreshed = true;
        } else {
            const response = NextResponse.redirect(new URL(`${localePrefix}/login`, request.url));
            response.cookies.delete(SESSION_OPTIONS.cookieName);
            return response;
        }
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

    const response = intlMiddleware(request);

    if (tokensRefreshed) {
        const ttl =
            (SESSION_OPTIONS.cookieOptions?.maxAge as number | undefined) ?? 7 * 24 * 60 * 60;
        const sealed = await sealData(session, {
            password: SESSION_OPTIONS.password as string,
            ttl,
        });
        response.cookies.set({
            name: SESSION_OPTIONS.cookieName,
            value: sealed,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: ttl,
            path: "/",
        });
    }

    return response;
}

export const config = {
    matcher: ["/((?!_next|_vercel|api|.*\\..*).*)"],
};
