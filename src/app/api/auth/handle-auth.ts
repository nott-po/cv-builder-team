import { type NextRequest, NextResponse } from "next/server";

import type { AuthResult } from "@/generated/graphql";
import { gqlRequest } from "@/lib/api/backend";
import { getSession } from "@/lib/auth/tokens";

type AuthConfig = {
    query: string;
    resultKey: string;
    errorStatus: number;
};

export function createAuthHandler(config: AuthConfig) {
    return async function POST(request: NextRequest) {
        let email: string, password: string;
        try {
            ({ email, password } = await request.json());
        } catch {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        email = email.trim();
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        let result;
        try {
            result = await gqlRequest<Record<string, AuthResult>>({
                query: config.query,
                variables: { auth: { email, password } },
            });
        } catch {
            return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
        }

        if (result.data.errors?.length) {
            return NextResponse.json(
                { error: result.data.errors[0].message },
                { status: config.errorStatus },
            );
        }

        const authResult = result.data.data?.[config.resultKey];
        if (!authResult) {
            return NextResponse.json(
                { error: "Authentication failed" },
                { status: config.errorStatus },
            );
        }
        const { access_token, refresh_token, user } = authResult;

        const session = await getSession();
        session.user = { id: user.id, email: user.email, role: user.role };
        session.accessToken = access_token;
        session.refreshToken = refresh_token;
        await session.save();

        return NextResponse.json({ user });
    };
}
