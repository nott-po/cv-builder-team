import { type NextRequest, NextResponse } from "next/server";

import type { UpdateTokenResult } from "@/generated/graphql";
import { gqlRequest, type GqlResponse } from "@/lib/api/backend";
import { getSession } from "@/lib/auth/tokens";
import { REFRESH_MUTATION } from "@/lib/graphql/operations/auth";

function isTokenExpiredError(status: number, body: GqlResponse): boolean {
    if (status === 401) return true;
    return (
        body.errors?.some(
            (e) => e.message === "Unauthorized" || e.extensions?.code === "UNAUTHENTICATED",
        ) ?? false
    );
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const session = await getSession();

    let status: number, data: GqlResponse;
    try {
        ({ status, data } = await gqlRequest(body, session.accessToken));
    } catch {
        return NextResponse.json({ errors: [{ message: "Service unavailable" }] }, { status: 503 });
    }

    if (isTokenExpiredError(status, data) && session.refreshToken) {
        let refreshResult: { updateToken?: UpdateTokenResult };
        try {
            const res = await gqlRequest<{ updateToken?: UpdateTokenResult }>(
                { query: REFRESH_MUTATION },
                session.refreshToken,
            );
            refreshResult = res.data?.data ?? {};
        } catch {
            return NextResponse.json(
                { errors: [{ message: "Service unavailable" }] },
                { status: 503 },
            );
        }

        const tokens = refreshResult.updateToken;

        if (tokens?.access_token && tokens?.refresh_token) {
            session.accessToken = tokens.access_token;
            session.refreshToken = tokens.refresh_token;
            await session.save();

            try {
                ({ status, data } = await gqlRequest(body, tokens.access_token));
            } catch {
                return NextResponse.json(
                    { errors: [{ message: "Service unavailable" }] },
                    { status: 503 },
                );
            }
        } else {
            session.destroy();
            return NextResponse.json(
                { errors: [{ message: "Session expired. Please log in again." }] },
                { status: 401 },
            );
        }
    }

    return NextResponse.json(data, { status });
}
