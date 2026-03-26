import { isPublicPath, isAdminPath, canAccess } from "@/lib/auth/permissions";
import { UserRole } from "@/lib/constants/roles";

jest.mock("@/lib/constants/routes", () => ({
    PUBLIC_ROUTES: ["/login", "/signup", "/"],
}));

jest.mock("@/lib/constants/roles", () => ({
    UserRole: {
        Admin: "ADMIN",
        User: "USER",
    },
}));

describe("Permissions Utilities", () => {
    describe("isPublicPath", () => {
        it("returns true for a defined public route", () => {
            expect(isPublicPath("/login")).toBe(true);
        });

        it("returns false for a route not in the public routes list", () => {
            expect(isPublicPath("/dashboard")).toBe(false);
        });
    });

    describe("isAdminPath", () => {
        it("returns true for the exact admin root path", () => {
            expect(isAdminPath("/admin")).toBe(true);
        });

        it("returns true for nested admin paths", () => {
            expect(isAdminPath("/admin/users")).toBe(true);
            expect(isAdminPath("/admin/settings")).toBe(true);
        });

        it("returns false for non-admin paths", () => {
            expect(isAdminPath("/dashboard")).toBe(false);
            expect(isAdminPath("/administrator")).toBe(false);
        });
    });

    describe("canAccess", () => {
        it("allows admin users to access admin paths", () => {
            expect(canAccess("/admin/settings", UserRole.Admin)).toBe(true);
        });

        it("denies non-admin users from accessing admin paths", () => {
            expect(canAccess("/admin/settings", UserRole.User)).toBe(false);
        });

        it("allows any user to access non-admin paths", () => {
            expect(canAccess("/dashboard", UserRole.User)).toBe(true);
            expect(canAccess("/profile", UserRole.Admin)).toBe(true);
        });
    });
});
