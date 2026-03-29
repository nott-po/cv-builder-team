import { render, screen } from "@testing-library/react";

import { PageHeader } from "@/components/shared/PageHeader";

jest.mock("@/i18n/routing", () => ({
    Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

describe("PageHeader", () => {
    it("renders nothing when items is empty", () => {
        const { container } = render(<PageHeader items={[]} />);

        expect(container.firstChild).toBeNull();
    });

    it("renders a single breadcrumb item as heading", () => {
        render(<PageHeader items={[{ label: "Employees" }]} />);

        expect(screen.getByRole("heading", { name: "Employees" })).toBeInTheDocument();
    });

    it("renders a link for non-last items with href", () => {
        render(<PageHeader items={[{ label: "Home", href: "/" }, { label: "Employees" }]} />);

        expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
        expect(screen.getByRole("heading", { name: "Employees" })).toBeInTheDocument();
    });

    it("renders icon when Icon is provided", () => {
        const MockIcon = (props: Record<string, unknown>) => (
            <svg data-testid="mock-icon" {...props} />
        );

        render(<PageHeader items={[{ label: "Home", Icon: MockIcon }]} />);

        expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
    });
});
