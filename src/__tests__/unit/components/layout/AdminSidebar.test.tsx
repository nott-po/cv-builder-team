import { render, screen } from "@testing-library/react";

import { AdminSidebar } from "@/components/layout/admin/AdminSidebar";

jest.mock("next-intl");

jest.mock("@/lib/hooks/useCurrentUser", () => ({
    useCurrentUser: () => ({
        initial: "A",
        displayName: "Admin User",
    }),
}));

jest.mock("@/components/layout/shared/AppSidebar", () => ({
    AppSidebar: ({
        navGroups,
        userInitial,
        userDisplayName,
    }: {
        navGroups: { href: string; label: string }[][];
        userInitial: string;
        userDisplayName: string;
    }) => (
        <div data-testid="app-sidebar">
            <span data-testid="user-initial">{userInitial}</span>
            <span data-testid="user-name">{userDisplayName}</span>
            {navGroups.flat().map((item) => (
                <a key={item.href} href={item.href}>
                    {item.label}
                </a>
            ))}
        </div>
    ),
}));

describe("AdminSidebar", () => {
    it("renders all admin navigation items", () => {
        render(<AdminSidebar />);

        expect(screen.getByText("employees")).toBeInTheDocument();
        expect(screen.getByText("projects")).toBeInTheDocument();
        expect(screen.getByText("cvs")).toBeInTheDocument();
        expect(screen.getByText("departments")).toBeInTheDocument();
        expect(screen.getByText("positions")).toBeInTheDocument();
        expect(screen.getByText("skills")).toBeInTheDocument();
        expect(screen.getByText("languages")).toBeInTheDocument();
        expect(screen.getByText("settings")).toBeInTheDocument();
    });

    it("passes user initial and display name to AppSidebar", () => {
        render(<AdminSidebar />);

        expect(screen.getByTestId("user-initial")).toHaveTextContent("A");
        expect(screen.getByTestId("user-name")).toHaveTextContent("Admin User");
    });
});
