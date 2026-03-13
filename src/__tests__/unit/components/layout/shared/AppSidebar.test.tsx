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
        <a href={href} className={className} data-testid="mock-link">
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
        (useCurrentUser as jest.Mock).mockReturnValue({ clearUser: mockClearUser });
    });

    it("renders user information correctly", () => {
        render(<AppSidebar {...defaultProps} />);

        const displayNames = screen.getAllByText("John Doe");
        expect(displayNames.length).toBeGreaterThan(0);
    });

    it("renders navigation links correctly", () => {
        render(<AppSidebar {...defaultProps} />);

        const dashboardLinks = screen.getAllByText("Dashboard");
        expect(dashboardLinks.length).toBeGreaterThan(0);

        const settingsLinks = screen.getAllByText("Settings");
        expect(settingsLinks.length).toBeGreaterThan(0);
    });

    it("handles logout process successfully", async () => {
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
});
