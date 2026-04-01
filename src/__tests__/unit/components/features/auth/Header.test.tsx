import { render, screen } from "@testing-library/react";

import { Header } from "@/components/features/auth/Header";

jest.mock("next-intl");

jest.mock("@/components/ui/button", () => ({
    Button: ({
        children,
        variant,
        ...props
    }: {
        children: React.ReactNode;
        variant?: string;
        asChild?: boolean;
    } & Record<string, unknown>) => (
        <span data-variant={variant} {...props}>
            {children}
        </span>
    ),
}));

jest.mock("@/i18n/routing", () => ({
    Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
        <a href={href}>{children}</a>
    ),
}));

describe("Auth Header", () => {
    it("renders login link pointing to /login", () => {
        render(<Header mode="login" />);

        expect(screen.getByRole("link", { name: "log_in" })).toHaveAttribute("href", "/login");
    });

    it("renders signup link pointing to /signup", () => {
        render(<Header mode="signup" />);

        expect(screen.getByRole("link", { name: "sign_up" })).toHaveAttribute("href", "/signup");
    });

    it("applies active variant to login button when mode is login", () => {
        const { container } = render(<Header mode="login" />);

        const buttons = container.querySelectorAll("[data-variant]");
        expect(buttons[0]).toHaveAttribute("data-variant", "redUnderline_active");
        expect(buttons[1]).toHaveAttribute("data-variant", "redUnderline_inactive");
    });

    it("applies active variant to signup button when mode is signup", () => {
        const { container } = render(<Header mode="signup" />);

        const buttons = container.querySelectorAll("[data-variant]");
        expect(buttons[0]).toHaveAttribute("data-variant", "redUnderline_inactive");
        expect(buttons[1]).toHaveAttribute("data-variant", "redUnderline_active");
    });
});
