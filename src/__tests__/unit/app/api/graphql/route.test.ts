/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

import { POST } from "@/app/api/graphql/route";
import { gqlRequest } from "@/lib/api/backend";
import { getSession } from "@/lib/auth/tokens";

jest.mock("@/lib/api/backend", () => ({
    gqlRequest: jest.fn(),
}));

jest.mock("@/lib/auth/tokens", () => ({
    getSession: jest.fn(),
}));

jest.mock("@/lib/graphql/operations/auth", () => ({
    REFRESH_MUTATION: "mutation UpdateToken { updateToken { access_token refresh_token } }",
}));

function makeRequest(body: unknown) {
    return new NextRequest("http://localhost/api/graphql", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
    });
}

function makeInvalidRequest() {
    return new NextRequest("http://localhost/api/graphql", {
        method: "POST",
        body: "not json",
        headers: { "Content-Type": "application/json" },
    });
}

describe("POST /api/graphql", () => {
    const mockSave = jest.fn();
    const mockDestroy = jest.fn();

    const makeSession = (overrides = {}) => ({
        accessToken: "valid-access-token",
        refreshToken: "valid-refresh-token",
        save: mockSave,
        destroy: mockDestroy,
        ...overrides,
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockSave.mockResolvedValue(undefined);
        (getSession as jest.Mock).mockResolvedValue(makeSession());
    });

    it("returns 400 for invalid JSON body", async () => {
        const req = makeInvalidRequest();
        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.errors[0].message).toBe("Invalid request body");
    });

    it("returns 400 when query is missing", async () => {
        const req = makeRequest({ variables: {} });
        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.errors[0].message).toBe("Missing query");
    });

    it("returns 400 when query is not a string", async () => {
        const req = makeRequest({ query: 123 });
        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.errors[0].message).toBe("Missing query");
    });

    it("proxies successful GraphQL response", async () => {
        const mockData = { data: { users: [{ id: "1" }] } };
        (gqlRequest as jest.Mock).mockResolvedValue({ status: 200, data: mockData });

        const req = makeRequest({ query: "{ users { id } }" });
        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json).toEqual(mockData);
        expect(gqlRequest).toHaveBeenCalledWith(
            { query: "{ users { id } }" },
            "valid-access-token",
        );
    });

    it("returns 503 when initial GraphQL request fails", async () => {
        (gqlRequest as jest.Mock).mockRejectedValue(new Error("ECONNREFUSED"));

        const req = makeRequest({ query: "{ users { id } }" });
        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(503);
        expect(json.errors[0].message).toBe("Service unavailable");
    });

    describe("token refresh flow", () => {
        it("refreshes token and retries on 401", async () => {
            const session = makeSession();
            (getSession as jest.Mock).mockResolvedValue(session);

            // First call returns 401
            (gqlRequest as jest.Mock)
                .mockResolvedValueOnce({
                    status: 401,
                    data: { errors: [{ message: "Unauthorized" }] },
                })
                // Refresh call succeeds
                .mockResolvedValueOnce({
                    status: 200,
                    data: {
                        data: {
                            updateToken: {
                                access_token: "new-access",
                                refresh_token: "new-refresh",
                            },
                        },
                    },
                })
                // Retry with new token succeeds
                .mockResolvedValueOnce({
                    status: 200,
                    data: { data: { users: [{ id: "1" }] } },
                });

            const req = makeRequest({ query: "{ users { id } }" });
            const res = await POST(req);
            const json = await res.json();

            expect(res.status).toBe(200);
            expect(json.data.users).toEqual([{ id: "1" }]);

            // Verify session was updated with new tokens
            expect(session.accessToken).toBe("new-access");
            expect(session.refreshToken).toBe("new-refresh");
            expect(mockSave).toHaveBeenCalled();
        });

        it("detects UNAUTHENTICATED extension code as token expired", async () => {
            const session = makeSession();
            (getSession as jest.Mock).mockResolvedValue(session);

            (gqlRequest as jest.Mock)
                .mockResolvedValueOnce({
                    status: 200,
                    data: {
                        errors: [
                            { message: "Token expired", extensions: { code: "UNAUTHENTICATED" } },
                        ],
                    },
                })
                .mockResolvedValueOnce({
                    status: 200,
                    data: {
                        data: {
                            updateToken: {
                                access_token: "new-access",
                                refresh_token: "new-refresh",
                            },
                        },
                    },
                })
                .mockResolvedValueOnce({
                    status: 200,
                    data: { data: { result: "ok" } },
                });

            const req = makeRequest({ query: "{ test }" });
            const res = await POST(req);

            expect(res.status).toBe(200);
            expect(mockSave).toHaveBeenCalled();
        });

        it("destroys session and returns 401 when refresh fails (no tokens returned)", async () => {
            const session = makeSession();
            (getSession as jest.Mock).mockResolvedValue(session);

            (gqlRequest as jest.Mock)
                .mockResolvedValueOnce({
                    status: 401,
                    data: { errors: [{ message: "Unauthorized" }] },
                })
                .mockResolvedValueOnce({
                    status: 200,
                    data: { data: { updateToken: null } },
                });

            const req = makeRequest({ query: "{ users { id } }" });
            const res = await POST(req);
            const json = await res.json();

            expect(res.status).toBe(401);
            expect(json.errors[0].message).toBe("Session expired. Please log in again.");
            expect(mockDestroy).toHaveBeenCalled();
        });

        it("does not attempt refresh when no refresh token exists", async () => {
            (getSession as jest.Mock).mockResolvedValue(makeSession({ refreshToken: undefined }));

            (gqlRequest as jest.Mock).mockResolvedValue({
                status: 401,
                data: { errors: [{ message: "Unauthorized" }] },
            });

            const req = makeRequest({ query: "{ users { id } }" });
            const res = await POST(req);

            // Should return the 401 directly without refresh attempt
            expect(res.status).toBe(401);
            expect(gqlRequest).toHaveBeenCalledTimes(1);
            expect(mockDestroy).not.toHaveBeenCalled();
        });

        it("returns 503 when refresh request throws", async () => {
            (gqlRequest as jest.Mock)
                .mockResolvedValueOnce({
                    status: 401,
                    data: { errors: [{ message: "Unauthorized" }] },
                })
                .mockRejectedValueOnce(new Error("Network error"));

            const req = makeRequest({ query: "{ users { id } }" });
            const res = await POST(req);
            const json = await res.json();

            expect(res.status).toBe(503);
            expect(json.errors[0].message).toBe("Service unavailable");
        });

        it("returns 503 when retry after refresh throws", async () => {
            const session = makeSession();
            (getSession as jest.Mock).mockResolvedValue(session);

            (gqlRequest as jest.Mock)
                .mockResolvedValueOnce({
                    status: 401,
                    data: { errors: [{ message: "Unauthorized" }] },
                })
                .mockResolvedValueOnce({
                    status: 200,
                    data: {
                        data: {
                            updateToken: {
                                access_token: "new-access",
                                refresh_token: "new-refresh",
                            },
                        },
                    },
                })
                .mockRejectedValueOnce(new Error("Network error on retry"));

            const req = makeRequest({ query: "{ test }" });
            const res = await POST(req);
            const json = await res.json();

            expect(res.status).toBe(503);
            expect(json.errors[0].message).toBe("Service unavailable");
        });
    });
});
