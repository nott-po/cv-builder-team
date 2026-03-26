import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AdminDepartmentTable } from "@/components/features/departments/AdminDepartmentTable";
import { useDepartmentTable } from "@/lib/hooks/useDepartmentTable";
import type { TableState } from "@/types/table";

jest.mock("next-intl");

jest.mock("@tanstack/react-query", () => ({
    useQueryClient: jest.fn(() => ({
        invalidateQueries: jest.fn(),
    })),
}));

jest.mock("@/lib/hooks/useDepartmentTable", () => ({
    useDepartmentTable: jest.fn(),
    departmentsListKey: () => ["departments", "list"],
}));

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

jest.mock("@/components/shared/NameOnlyTableSkeleton", () => ({
    NameOnlyTableSkeleton: () => <div data-testid="skeleton" />,
}));

jest.mock("@/components/shared/ErrorMessage", () => ({
    ErrorMessage: () => <div data-testid="error" />,
}));

jest.mock("@/components/shared/AdminNameModal", () => ({
    AdminNameModal: ({ open, title }: { open: boolean; title: string }) =>
        open ? <div data-testid="name-modal">{title}</div> : null,
}));

jest.mock("@/components/shared/AdminDeleteModal", () => ({
    AdminDeleteModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="delete-modal">Delete</div> : null,
}));

const noop = jest.fn();

const makeState = (overrides: Partial<TableState> = {}): TableState => ({
    isLoading: false,
    isError: false,
    isEmpty: false,
    search: "",
    onSearchChange: noop,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    onPageChange: noop,
    onPageSizeChange: noop,
    ...overrides,
});

const mockDepartments = [
    { id: "dept-1", name: "Engineering" },
    { id: "dept-2", name: "HR" },
];

describe("AdminDepartmentTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useDepartmentTable as jest.Mock).mockReturnValue({
            state: makeState(),
            paginatedDepartments: mockDepartments,
        });
    });

    it("renders department names in the table", () => {
        render(<AdminDepartmentTable />);

        expect(screen.getByText("Engineering")).toBeInTheDocument();
        expect(screen.getByText("HR")).toBeInTheDocument();
    });

    it("opens create modal when create button is clicked", async () => {
        const user = userEvent.setup();
        render(<AdminDepartmentTable />);

        await user.click(screen.getByText("create_department"));

        expect(screen.getByTestId("name-modal")).toHaveTextContent("create_department_title");
    });

    it("renders row action buttons for each department", () => {
        render(<AdminDepartmentTable />);

        const actionButtons = screen.getAllByRole("button", { name: "department_actions" });
        expect(actionButtons).toHaveLength(2);
    });

    it("opens edit modal when edit action is triggered", async () => {
        const user = userEvent.setup();
        render(<AdminDepartmentTable />);

        await user.click(screen.getAllByRole("button", { name: "department_actions" })[0]);
        await user.click(screen.getByText("edit"));

        expect(screen.getByTestId("name-modal")).toHaveTextContent("edit_department_title");
    });

    it("opens delete modal when delete action is triggered", async () => {
        const user = userEvent.setup();
        render(<AdminDepartmentTable />);

        await user.click(screen.getAllByRole("button", { name: "department_actions" })[0]);
        await user.click(screen.getByText("delete"));

        expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    });

    it("renders empty state when no departments exist", () => {
        (useDepartmentTable as jest.Mock).mockReturnValue({
            state: makeState({ isEmpty: true }),
            paginatedDepartments: [],
        });

        render(<AdminDepartmentTable />);

        expect(screen.getByText("no_departments")).toBeInTheDocument();
    });

    it("renders loading skeleton when loading", () => {
        (useDepartmentTable as jest.Mock).mockReturnValue({
            state: makeState({ isLoading: true }),
            paginatedDepartments: [],
        });

        render(<AdminDepartmentTable />);

        expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });

    it("renders error message when data fails to load", () => {
        (useDepartmentTable as jest.Mock).mockReturnValue({
            state: makeState({ isError: true }),
            paginatedDepartments: [],
        });

        render(<AdminDepartmentTable />);

        expect(screen.getByTestId("error")).toBeInTheDocument();
    });
});
