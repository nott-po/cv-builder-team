/**
 * @jest-environment node
 */
import { GET } from "@/app/api/auth/me/route";
import { getSession } from "@/lib/auth/tokens";

jest.mock("@/lib/auth/tokens", () => ({
    getSession: jest.fn(),
}));

describe("GET /api/auth/me", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns user data when session has a user", async () => {
        const mockUser = { id: "1", email: "test@test.com", role: "Employee" };
        (getSession as jest.Mock).mockResolvedValue({ user: mockUser });

        const res = await GET();
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.user).toEqual(mockUser);
    });

    it("returns 401 when session has no user", async () => {
        (getSession as jest.Mock).mockResolvedValue({ user: undefined });

        const res = await GET();
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.error).toBe("Unauthorized");
    });

    it("returns 401 when user has no id", async () => {
        (getSession as jest.Mock).mockResolvedValue({
            user: { id: undefined, email: "test@test.com" },
        });

        const res = await GET();
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.error).toBe("Unauthorized");
    });

    it("returns 401 when session is empty object", async () => {
        (getSession as jest.Mock).mockResolvedValue({});

        const res = await GET();

        expect(res.status).toBe(401);
    });
});
