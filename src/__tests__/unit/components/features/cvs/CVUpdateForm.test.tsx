import { render, screen } from "@testing-library/react";

import { CVUpdateForm } from "@/components/features/cvs/CVUpdateForm";

jest.mock("next-intl");

jest.mock("next/navigation", () => ({
    useParams: () => ({ id: "cv-123" }),
}));

jest.mock("@/i18n/routing", () => ({
    Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
        <a href={href}>{children}</a>
    ),
}));

const mockMutateAsync = jest.fn();

jest.mock("@/lib/hooks/useUpdateCV", () => ({
    useUpdateCV: () => ({
        mutateAsync: mockMutateAsync,
        isPending: false,
        error: null,
    }),
}));

jest.mock("@/lib/hooks/useCurrentUser", () => ({
    useCurrentUser: () => ({ user: { id: "user-1", role: "Employee" } }),
}));

const mockCv = {
    id: "cv-123",
    created_at: "2024-01-01",
    name: "Test CV",
    education: "MIT",
    description: "A great CV",
    user: {
        id: "u1",
        email: "test@test.com",
        position_name: "Dev",
        profile: { full_name: "John" },
    },
    projects: [],
    skills: [],
    languages: [],
};

let useCvReturn = {
    cv: mockCv as typeof mockCv | undefined,
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
};

jest.mock("@/lib/hooks/useCV", () => ({
    useCv: () => useCvReturn,
}));

jest.mock("@/components/features/cvs/UserCVHeader", () => ({
    UserCVHeader: ({ mode }: { mode: string }) => <div data-testid="cv-header">{mode}</div>,
}));

jest.mock("@/components/shared/ErrorMessage", () => ({
    ErrorMessage: ({ message }: { message: string }) => (
        <div data-testid="error-message">{message}</div>
    ),
}));

jest.mock("@/components/shared/PageHeader", () => ({
    PageHeader: ({ items }: { items: { label: string }[] }) => (
        <nav data-testid="page-header">
            {items.map((item) => (
                <span key={item.label}>{item.label}</span>
            ))}
        </nav>
    ),
}));

describe("CVUpdateForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useCvReturn = {
            cv: mockCv,
            isLoading: false,
            isError: false,
            refetch: jest.fn(),
        };
    });

    it("renders form fields with CV data", () => {
        render(<CVUpdateForm />);

        expect(screen.getByDisplayValue("Test CV")).toBeInTheDocument();
        expect(screen.getByDisplayValue("MIT")).toBeInTheDocument();
        expect(screen.getByDisplayValue("A great CV")).toBeInTheDocument();
    });

    it("renders page header with breadcrumbs", () => {
        render(<CVUpdateForm />);

        expect(screen.getByTestId("page-header")).toBeInTheDocument();
        expect(screen.getByText("cvs")).toBeInTheDocument();
        expect(screen.getByText("Test CV")).toBeInTheDocument();
    });

    it("renders CV header in details mode", () => {
        render(<CVUpdateForm />);

        expect(screen.getByTestId("cv-header")).toHaveTextContent("details");
    });

    it("renders update button disabled when form is not dirty", () => {
        render(<CVUpdateForm />);

        expect(screen.getByText("update")).toBeDisabled();
    });

    it("shows error message when fetch fails", () => {
        useCvReturn = {
            cv: undefined,
            isLoading: false,
            isError: true,
            refetch: jest.fn(),
        };

        render(<CVUpdateForm />);

        expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });

    it("shows loading skeleton when fetching", () => {
        useCvReturn = {
            cv: undefined,
            isLoading: true,
            isError: false,
            refetch: jest.fn(),
        };

        render(<CVUpdateForm />);

        expect(screen.queryByDisplayValue("Test CV")).not.toBeInTheDocument();
    });
});
