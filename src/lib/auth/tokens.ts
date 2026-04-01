import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import type { SessionData } from "@/types/auth";

if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET environment variable is not set");
}

// Matches the refresh token TTL (7d). The session cookie is meaningless after
// the refresh token expires, so there is no reason to keep it longer.
const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;

export const SESSION_OPTIONS: SessionOptions = {
    password: process.env.SESSION_SECRET,
    cookieName: "cv_session",
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: SEVEN_DAYS_IN_SECONDS,
    },
};

export async function getSession() {
    return getIronSession<SessionData>(await cookies(), SESSION_OPTIONS);
}
