import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CVTable } from "@/components/features/cvs/CVTable";

jest.mock("next-intl");

jest.mock("@/i18n/routing", () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("next/navigation", () => ({
    useSearchParams: () => new URLSearchParams(),
}));

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

const mockHandleRowClick = jest.fn();
const mockHandleSortToggle = jest.fn();
const mockHandleSearchChange = jest.fn();

const defaultTableReturn = {
    paginatedCvs: [
        {
            id: "cv-1",
            created_at: "2024-01-01",
            name: "My CV",
            education: "MIT",
            description: "A test CV description",
            user: { id: "u1", email: "test@test.com" },
        },
        {
            id: "cv-2",
            created_at: "2024-02-01",
            name: "Another CV",
            education: null,
            description: "Another description",
            user: null,
        },
    ],
    isLoading: false,
    isError: false,
    search: "",
    handleSearchChange: mockHandleSearchChange,
    handleSortToggle: mockHandleSortToggle,
    sortDir: "asc" as const,
    handleRowClick: mockHandleRowClick,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    handlePageChange: jest.fn(),
    handlePageSizeChange: jest.fn(),
    refetch: jest.fn(),
};

jest.mock("@/lib/hooks/useCVTable", () => ({
    useCVTable: () => defaultTableReturn,
    cvsListKey: (id: string) => ["cvs", id],
}));

jest.mock("@/lib/hooks/useCurrentUser", () => ({
    useCurrentUser: () => ({ user: { id: "user-1", email: "test@test.com", role: "Employee" } }),
}));

jest.mock("@/components/features/cvs/CreateCVModal", () => ({
    CreateCVModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="create-modal">Create Modal</div> : null,
}));

jest.mock("@/components/features/cvs/DeleteCVModal", () => ({
    DeleteCVModal: ({ open, cv }: { open: boolean; cv: { name: string } | null }) =>
        open ? <div data-testid="delete-modal">{cv?.name}</div> : null,
}));

jest.mock("@/components/shared/CVTableSkeleton", () => ({
    CVTableSkeleton: () => <div data-testid="skeleton" />,
}));

jest.mock("@/components/shared/DataTable", () => ({
    DataTable: ({
        children,
        head,
        actions,
        state,
    }: {
        children: React.ReactNode;
        head: React.ReactNode;
        actions: React.ReactNode;
        state: { isLoading: boolean };
    }) => (
        <div data-testid="data-table">
            <div data-testid="actions">{actions}</div>
            {!state.isLoading && (
                <table>
                    <thead>
                        <tr>{head}</tr>
                    </thead>
                    <tbody>{children}</tbody>
                </table>
            )}
        </div>
    ),
}));

describe("CVTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the data table with CV rows", () => {
        render(<CVTable />);

        expect(screen.getByText("My CV")).toBeInTheDocument();
        expect(screen.getByText("Another CV")).toBeInTheDocument();
    });

    it("displays education or dash for null values", () => {
        render(<CVTable />);

        expect(screen.getByText("MIT")).toBeInTheDocument();
        expect(screen.getAllByText("—").length).toBeGreaterThan(0);
    });

    it("displays CV description", () => {
        render(<CVTable />);

        expect(screen.getByText("A test CV description")).toBeInTheDocument();
    });

    it("renders create CV button", () => {
        render(<CVTable />);

        expect(screen.getByText("create_cv")).toBeInTheDocument();
    });

    it("opens create modal when create button is clicked", async () => {
        const user = userEvent.setup();
        render(<CVTable />);

        await user.click(screen.getByText("create_cv"));

        expect(screen.getByTestId("create-modal")).toBeInTheDocument();
    });

    it("displays user email or dash for null user", () => {
        render(<CVTable />);

        expect(screen.getByText("test@test.com")).toBeInTheDocument();
    });
});
