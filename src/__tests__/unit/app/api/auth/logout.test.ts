/**
 * @jest-environment node
 */
import { POST } from "@/app/api/auth/logout/route";
import { getSession } from "@/lib/auth/tokens";

jest.mock("@/lib/auth/tokens", () => ({
    getSession: jest.fn(),
}));

describe("POST /api/auth/logout", () => {
    const mockDestroy = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (getSession as jest.Mock).mockResolvedValue({
            user: { id: "1", email: "test@test.com" },
            destroy: mockDestroy,
        });
    });

    it("destroys the session", async () => {
        await POST();

        expect(mockDestroy).toHaveBeenCalled();
    });

    it("returns success response", async () => {
        const res = await POST();
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
    });
});
