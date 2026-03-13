import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EmployeeTable } from "@/components/features/employees/EmployeeTable";
import { useEmployeeTable } from "@/lib/hooks/useEmployeeTable";

jest.mock("next-intl");

jest.mock("@/lib/hooks/useEmployeeTable", () => ({
    useEmployeeTable: jest.fn(),
    PAGE_SIZE_OPTIONS: [10, 20, 50],
}));

jest.mock("@/components/shared/EmployeeTableSkeleton", () => ({
    EmployeeTableSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

jest.mock("@/components/shared/ErrorMessage", () => ({
    ErrorMessage: ({ message }: { message: string }) => <div data-testid="error">{message}</div>,
}));

const mockHandleSearchChange = jest.fn();
const mockHandleSortToggle = jest.fn();
const mockSetPage = jest.fn();
const mockHandlePageSizeChange = jest.fn();
const mockHandleRowClick = jest.fn();

const defaultHookValues = {
    paginatedEmployees: [],
    isLoading: false,
    isError: false,
    search: "",
    handleSearchChange: mockHandleSearchChange,
    sortDir: "asc",
    handleSortToggle: mockHandleSortToggle,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    setPage: mockSetPage,
    handlePageSizeChange: mockHandlePageSizeChange,
    handleRowClick: mockHandleRowClick,
};

const mockEmployee = {
    id: "emp-1",
    email: "john.doe@example.com",
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
        (useEmployeeTable as jest.Mock).mockReturnValue(defaultHookValues);
    });

    it("should render loading skeleton when isLoading is true", () => {
        (useEmployeeTable as jest.Mock).mockReturnValue({
            ...defaultHookValues,
            isLoading: true,
        });

        render(<EmployeeTable />);

        expect(screen.getByTestId("skeleton")).toBeInTheDocument();
        expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });

    it("should render error message when isError is true", () => {
        (useEmployeeTable as jest.Mock).mockReturnValue({
            ...defaultHookValues,
            isError: true,
        });

        render(<EmployeeTable />);

        expect(screen.getByTestId("error")).toHaveTextContent("error");
        expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });

    it("should render empty state when there are no employees", () => {
        render(<EmployeeTable />);

        expect(screen.getByRole("table")).toBeInTheDocument();
        expect(screen.getByText("no_employees")).toBeInTheDocument();
    });

    it("should render employee data correctly", () => {
        (useEmployeeTable as jest.Mock).mockReturnValue({
            ...defaultHookValues,
            paginatedEmployees: [mockEmployee],
        });

        render(<EmployeeTable />);

        expect(screen.getByText("John")).toBeInTheDocument();
        expect(screen.getByText("Doe")).toBeInTheDocument();
        expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
        expect(screen.getByText("Engineering")).toBeInTheDocument();
        expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    });

    it("should call handleRowClick when a row is clicked", async () => {
        const user = userEvent.setup();
        (useEmployeeTable as jest.Mock).mockReturnValue({
            ...defaultHookValues,
            paginatedEmployees: [mockEmployee],
        });

        render(<EmployeeTable />);

        const row = screen.getByText("john.doe@example.com").closest("tr");
        expect(row).not.toBeNull();

        await user.click(row!);

        expect(mockHandleRowClick).toHaveBeenCalledWith("emp-1");
    });

    it("should call handleSortToggle when department header is clicked", async () => {
        const user = userEvent.setup();
        render(<EmployeeTable />);

        const sortButton = screen.getByText("department");

        await user.click(sortButton);

        expect(mockHandleSortToggle).toHaveBeenCalledTimes(1);
    });
});
