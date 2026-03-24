import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EmployeeTable } from "@/components/features/employees/user/EmployeeTable";
import { useEmployeeTable } from "@/lib/hooks/useEmployeeTable";
import type { TableState } from "@/types/table";

jest.mock("next-intl");

jest.mock("@/components/features/employees/user/EmployeeTableSkeleton", () => ({
    EmployeeTableSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

jest.mock("@/components/shared/ErrorMessage", () => ({
    ErrorMessage: ({ message }: { message: string }) => <div data-testid="error">{message}</div>,
}));

jest.mock("@/lib/hooks/useEmployeeTable", () => ({
    useEmployeeTable: jest.fn(),
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

const mockHandleRowClick = jest.fn();
const mockHandleSortToggle = jest.fn();

const defaultHookValues = {
    state: makeState(),
    paginatedEmployees: [],
    sortDir: "desc" as const,
    handleSortToggle: mockHandleSortToggle,
    handleRowClick: mockHandleRowClick,
};

const mockEmployee = {
    id: "emp-1",
    email: "john.doe@example.com",
    role: "Employee" as const,
    department_name: "Engineering",
    position_name: "Frontend Developer",
    profile: {
        first_name: "John",
        last_name: "Doe",
        avatar: null,
    },
};

describe("EmployeeTable Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useEmployeeTable as jest.Mock).mockReturnValue({
            ...defaultHookValues,
            state: makeState({ isEmpty: true }),
        });
    });

    it("renders loading skeleton when isLoading is true", () => {
        (useEmployeeTable as jest.Mock).mockReturnValue({
            ...defaultHookValues,
            state: makeState({ isLoading: true }),
        });
        render(<EmployeeTable />);

        expect(screen.getByTestId("skeleton")).toBeInTheDocument();
        expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });

    it("renders error message when isError is true", () => {
        (useEmployeeTable as jest.Mock).mockReturnValue({
            ...defaultHookValues,
            state: makeState({ isError: true }),
        });
        render(<EmployeeTable />);

        expect(screen.getByTestId("error")).toBeInTheDocument();
        expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });

    it("renders empty state when there are no employees", () => {
        render(<EmployeeTable />);

        expect(screen.getByRole("table")).toBeInTheDocument();
        expect(screen.getByText("no_employees")).toBeInTheDocument();
    });

    it("renders employee data correctly", () => {
        (useEmployeeTable as jest.Mock).mockReturnValue({
            ...defaultHookValues,
            state: makeState(),
            paginatedEmployees: [mockEmployee],
        });
        render(<EmployeeTable />);

        expect(screen.getByText("John")).toBeInTheDocument();
        expect(screen.getByText("Doe")).toBeInTheDocument();
        expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
        expect(screen.getByText("Engineering")).toBeInTheDocument();
        expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    });

    it("renders dash for missing profile fields", () => {
        (useEmployeeTable as jest.Mock).mockReturnValue({
            ...defaultHookValues,
            state: makeState(),
            paginatedEmployees: [
                {
                    ...mockEmployee,
                    department_name: null,
                    position_name: null,
                    profile: { first_name: null, last_name: null, avatar: null },
                },
            ],
        });
        render(<EmployeeTable />);

        const dashes = screen.getAllByText("—");
        expect(dashes.length).toBe(4);
    });

    it("calls handleRowClick when a row is clicked", async () => {
        const user = userEvent.setup();
        (useEmployeeTable as jest.Mock).mockReturnValue({
            ...defaultHookValues,
            state: makeState(),
            paginatedEmployees: [mockEmployee],
        });
        render(<EmployeeTable />);

        const row = screen.getByText("john.doe@example.com").closest("tr");
        await user.click(row!);

        expect(mockHandleRowClick).toHaveBeenCalledWith("emp-1");
    });

    it("passes basePath to useEmployeeTable", () => {
        render(<EmployeeTable basePath="/admin/employees" />);

        expect(useEmployeeTable).toHaveBeenCalledWith("/admin/employees");
    });
});
