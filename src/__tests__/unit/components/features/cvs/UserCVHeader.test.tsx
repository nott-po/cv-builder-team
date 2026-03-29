import { render, screen } from "@testing-library/react";

import { UserCVHeader } from "@/components/features/cvs/UserCVHeader";

jest.mock("next-intl");

jest.mock("next/navigation", () => ({
    useParams: () => ({ id: "cv-123" }),
}));

jest.mock("@/i18n/routing", () => ({
    Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
        <a href={href}>{children}</a>
    ),
}));

describe("UserCVHeader", () => {
    it("renders all four navigation tabs", () => {
        render(<UserCVHeader mode="details" />);

        expect(screen.getByText("details")).toBeInTheDocument();
        expect(screen.getByText("skills")).toBeInTheDocument();
        expect(screen.getByText("projects")).toBeInTheDocument();
        expect(screen.getByText("preview")).toBeInTheDocument();
    });

    it("generates user paths when isAdmin is false", () => {
        render(<UserCVHeader mode="details" />);

        expect(screen.getByText("details").closest("a")).toHaveAttribute("href", "/cvs/cv-123");
        expect(screen.getByText("skills").closest("a")).toHaveAttribute(
            "href",
            "/cvs/cv-123/skills",
        );
        expect(screen.getByText("projects").closest("a")).toHaveAttribute(
            "href",
            "/cvs/cv-123/projects",
        );
        expect(screen.getByText("preview").closest("a")).toHaveAttribute(
            "href",
            "/cvs/cv-123/preview",
        );
    });

    it("generates admin paths when isAdmin is true", () => {
        render(<UserCVHeader mode="details" isAdmin={true} />);

        expect(screen.getByText("details").closest("a")).toHaveAttribute(
            "href",
            "/admin/cvs/cv-123",
        );
        expect(screen.getByText("skills").closest("a")).toHaveAttribute(
            "href",
            "/admin/cvs/cv-123/skills",
        );
        expect(screen.getByText("projects").closest("a")).toHaveAttribute(
            "href",
            "/admin/cvs/cv-123/projects",
        );
        expect(screen.getByText("preview").closest("a")).toHaveAttribute(
            "href",
            "/admin/cvs/cv-123/preview",
        );
    });
});
