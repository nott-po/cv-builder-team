import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppSidebar } from "@/components/layout/shared/AppSidebar";
import { useRouter } from "@/i18n/routing";
import apiClient from "@/lib/api/client";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

jest.mock("next-intl");
jest.mock("@/i18n/routing", () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(() => "/dashboard"),
    Link: ({
        children,
        href,
        className,
    }: {
        children: React.ReactNode;
        href: string;
        className?: string;
    }) => (
        <a href={href} className={className}>
            {children}
        </a>
    ),
}));

jest.mock("@/lib/api/client", () => ({
    __esModule: true,
    default: {
        post: jest.fn(),
    },
}));

jest.mock("@/lib/hooks/useCurrentUser", () => ({
    useCurrentUser: jest.fn(),
}));

jest.mock("@/lib/hooks/useUserData", () => ({
    useUserData: jest.fn(() => ({ data: null })),
}));

const MockIcon = () => <svg data-testid="mock-icon" />;

describe("AppSidebar Component", () => {
    const mockRouterPush = jest.fn();
    const mockClearUser = jest.fn();

    const defaultProps = {
        navGroups: [
            [{ href: "/dashboard", label: "Dashboard", Icon: MockIcon }],
            [{ href: "/settings", label: "Settings", Icon: MockIcon }],
        ],
        userInitial: "J",
        userDisplayName: "John Doe",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
        (useCurrentUser as jest.Mock).mockReturnValue({
            user: { id: "1", email: "john@test.com" },
            clearUser: mockClearUser,
        });
    });

    it("renders user display name", () => {
        render(<AppSidebar {...defaultProps} />);

        const displayNames = screen.getAllByText("John Doe");
        expect(displayNames.length).toBeGreaterThan(0);
    });

    it("renders navigation links for all groups", () => {
        render(<AppSidebar {...defaultProps} />);

        const dashboardLinks = screen.getAllByText("Dashboard");
        expect(dashboardLinks.length).toBeGreaterThan(0);

        const settingsLinks = screen.getAllByText("Settings");
        expect(settingsLinks.length).toBeGreaterThan(0);
    });

    it("calls API, clears user, and redirects on logout", async () => {
        const user = userEvent.setup();
        (apiClient.post as jest.Mock).mockResolvedValueOnce({});

        render(<AppSidebar {...defaultProps} />);

        const logoutButtons = screen.getAllByRole("button", { name: "log_out" });
        await user.click(logoutButtons[0]);

        await waitFor(() => {
            expect(apiClient.post).toHaveBeenCalledWith("/auth/logout");
            expect(mockClearUser).toHaveBeenCalled();
            expect(mockRouterPush).toHaveBeenCalledWith("/login");
        });
    });

    it("logout calls happen in correct order (API first, then clear, then redirect)", async () => {
        const user = userEvent.setup();
        const callOrder: string[] = [];

        (apiClient.post as jest.Mock).mockImplementation(async () => {
            callOrder.push("api");
        });
        mockClearUser.mockImplementation(() => {
            callOrder.push("clearUser");
        });
        mockRouterPush.mockImplementation(() => {
            callOrder.push("redirect");
        });

        render(<AppSidebar {...defaultProps} />);

        const logoutButtons = screen.getAllByRole("button", { name: "log_out" });
        await user.click(logoutButtons[0]);

        await waitFor(() => {
            expect(callOrder).toEqual(["api", "clearUser", "redirect"]);
        });
    });

    it("renders profile link pointing to /profile", () => {
        render(<AppSidebar {...defaultProps} />);

        const profileLinks = screen
            .getAllByRole("link")
            .filter((link) => link.getAttribute("href") === "/profile");
        expect(profileLinks.length).toBeGreaterThan(0);
    });
});
