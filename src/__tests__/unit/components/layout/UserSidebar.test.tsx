import { render, screen } from "@testing-library/react";

import { UserSidebar } from "@/components/layout/user/UserSidebar";

jest.mock("next-intl");

jest.mock("@/lib/hooks/useCurrentUser", () => ({
    useCurrentUser: () => ({
        initial: "J",
        displayName: "John Doe",
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

describe("UserSidebar", () => {
    it("renders all user navigation items", () => {
        render(<UserSidebar />);

        expect(screen.getByText("employees")).toBeInTheDocument();
        expect(screen.getByText("skills")).toBeInTheDocument();
        expect(screen.getByText("languages")).toBeInTheDocument();
        expect(screen.getByText("cvs")).toBeInTheDocument();
        expect(screen.getByText("settings")).toBeInTheDocument();
    });

    it("passes user initial and display name to AppSidebar", () => {
        render(<UserSidebar />);

        expect(screen.getByTestId("user-initial")).toHaveTextContent("J");
        expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");
    });
});
