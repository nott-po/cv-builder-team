/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

import { createAuthHandler } from "@/app/api/auth/handle-auth";
import { gqlRequest } from "@/lib/api/backend";
import { getSession } from "@/lib/auth/tokens";

jest.mock("@/lib/api/backend", () => ({
    gqlRequest: jest.fn(),
}));

jest.mock("@/lib/auth/tokens", () => ({
    getSession: jest.fn(),
}));

function makeRequest(body: unknown) {
    return new NextRequest("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
    });
}

function makeInvalidRequest() {
    return new NextRequest("http://localhost/api/auth/login", {
        method: "POST",
        body: "not json",
        headers: { "Content-Type": "application/json" },
    });
}

const handler = createAuthHandler({
    query: "mutation Login($auth: AuthInput!) { login(auth: $auth) { access_token refresh_token user { id email role } } }",
    resultKey: "login",
    errorStatus: 401,
});

describe("createAuthHandler", () => {
    const mockSave = jest.fn();
    const mockSession: Record<string, unknown> = {};

    beforeEach(() => {
        jest.clearAllMocks();
        Object.keys(mockSession).forEach((k) => delete mockSession[k]);
        mockSave.mockResolvedValue(undefined);
        (getSession as jest.Mock).mockResolvedValue({
            ...mockSession,
            save: mockSave,
            set user(v: unknown) {
                mockSession.user = v;
            },
            get user() {
                return mockSession.user;
            },
            set accessToken(v: unknown) {
                mockSession.accessToken = v;
            },
            get accessToken() {
                return mockSession.accessToken;
            },
            set refreshToken(v: unknown) {
                mockSession.refreshToken = v;
            },
            get refreshToken() {
                return mockSession.refreshToken;
            },
        });
    });

    it("returns 400 for invalid JSON body", async () => {
        const req = makeInvalidRequest();
        const res = await handler(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toBe("Invalid request body");
    });

    it("returns 400 when email is missing", async () => {
        const req = makeRequest({ password: "test123" });
        const res = await handler(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toBe("Email and password are required");
    });

    it("returns 400 when password is missing", async () => {
        const req = makeRequest({ email: "test@test.com" });
        const res = await handler(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toBe("Email and password are required");
    });

    it("returns 400 when email is not a string", async () => {
        const req = makeRequest({ email: 123, password: "test123" });
        const res = await handler(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toBe("Email and password are required");
    });

    it("returns 400 when email is empty after trimming", async () => {
        const req = makeRequest({ email: "   ", password: "test123" });
        const res = await handler(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toBe("Email and password are required");
    });

    it("returns 503 when GraphQL service is unavailable", async () => {
        (gqlRequest as jest.Mock).mockRejectedValue(new Error("ECONNREFUSED"));

        const req = makeRequest({ email: "test@test.com", password: "pass123" });
        const res = await handler(req);
        const json = await res.json();

        expect(res.status).toBe(503);
        expect(json.error).toBe("Service unavailable");
    });

    it("returns error status when GraphQL returns errors", async () => {
        (gqlRequest as jest.Mock).mockResolvedValue({
            status: 200,
            data: {
                errors: [{ message: "Invalid credentials" }],
                data: null,
            },
        });

        const req = makeRequest({ email: "test@test.com", password: "wrong" });
        const res = await handler(req);
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.error).toBe("Invalid credentials");
    });

    it("returns error status when auth result is missing", async () => {
        (gqlRequest as jest.Mock).mockResolvedValue({
            status: 200,
            data: { data: { login: null } },
        });

        const req = makeRequest({ email: "test@test.com", password: "pass123" });
        const res = await handler(req);
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.error).toBe("Authentication failed");
    });

    it("stores session and returns user on successful auth", async () => {
        const mockUser = { id: "1", email: "test@test.com", role: "Employee" };
        (gqlRequest as jest.Mock).mockResolvedValue({
            status: 200,
            data: {
                data: {
                    login: {
                        access_token: "access-123",
                        refresh_token: "refresh-456",
                        user: mockUser,
                    },
                },
            },
        });

        const req = makeRequest({ email: "test@test.com", password: "ValidPass123!" });
        const res = await handler(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.user).toEqual(mockUser);
        expect(mockSession.user).toEqual({
            id: "1",
            email: "test@test.com",
            role: "Employee",
        });
        expect(mockSession.accessToken).toBe("access-123");
        expect(mockSession.refreshToken).toBe("refresh-456");
        expect(mockSave).toHaveBeenCalled();
    });

    it("trims email before sending to GraphQL", async () => {
        const mockUser = { id: "1", email: "test@test.com", role: "Employee" };
        (gqlRequest as jest.Mock).mockResolvedValue({
            status: 200,
            data: {
                data: {
                    login: {
                        access_token: "at",
                        refresh_token: "rt",
                        user: mockUser,
                    },
                },
            },
        });

        const req = makeRequest({ email: "  test@test.com  ", password: "pass123" });
        await handler(req);

        expect(gqlRequest).toHaveBeenCalledWith(
            expect.objectContaining({
                variables: { auth: { email: "test@test.com", password: "pass123" } },
            }),
        );
    });

    it("uses config errorStatus for GraphQL errors (signup uses 400)", async () => {
        const signupHandler = createAuthHandler({
            query: "mutation Signup { ... }",
            resultKey: "signup",
            errorStatus: 400,
        });

        (gqlRequest as jest.Mock).mockResolvedValue({
            status: 200,
            data: {
                errors: [{ message: "Email already exists" }],
                data: null,
            },
        });

        const req = makeRequest({ email: "test@test.com", password: "pass123" });
        const res = await signupHandler(req);

        expect(res.status).toBe(400);
    });
});
