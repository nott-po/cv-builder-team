import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EmployeeTable } from "@/components/shared/EmployeeTable";
import { useEmployeeTable } from "@/lib/hooks/useEmployeeTable";

jest.mock("next-intl");

jest.mock("@/components/shared/EmployeeTableSkeleton", () => ({
    EmployeeTableSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

jest.mock("@/components/shared/ErrorMessage", () => ({
    ErrorMessage: () => <div data-testid="error">Error</div>,
}));

jest.mock("@/lib/hooks/useEmployeeTable", () => ({
    useEmployeeTable: jest.fn(),
    PAGE_SIZE_OPTIONS: [10, 20, 50],
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

    it("renders loading skeleton when isLoading is true", () => {
        (useEmployeeTable as jest.Mock).mockReturnValue({
            ...defaultHookValues,
            isLoading: true,
        });
        render(<EmployeeTable />);

        // Таблицы быть не должно
        expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });

    it("renders error message when isError is true", () => {
        (useEmployeeTable as jest.Mock).mockReturnValue({
            ...defaultHookValues,
            isError: true,
        });
        render(<EmployeeTable />);

        // Проверяем, что компонент не отрендерил таблицу
        expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });

    it("renders empty state when there are no employees", () => {
        render(<EmployeeTable />);
        expect(screen.getByRole("table")).toBeInTheDocument();
        // В пустом состоянии выводится ключ перевода "no_employees"
        expect(screen.getByText("no_employees")).toBeInTheDocument();
    });

    it("renders employee data correctly", () => {
        (useEmployeeTable as jest.Mock).mockReturnValue({
            ...defaultHookValues,
            paginatedEmployees: [mockEmployee],
        });
        render(<EmployeeTable />);

        expect(screen.getByText("John")).toBeInTheDocument();
        expect(screen.getByText("Doe")).toBeInTheDocument();
        expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    });

    it("calls handleRowClick when a row is clicked", async () => {
        const user = userEvent.setup();
        (useEmployeeTable as jest.Mock).mockReturnValue({
            ...defaultHookValues,
            paginatedEmployees: [mockEmployee],
        });
        render(<EmployeeTable />);

        const row = screen.getByText("john.doe@example.com").closest("tr");
        await user.click(row!);

        expect(mockHandleRowClick).toHaveBeenCalledWith("emp-1");
    });

    it("calls handleSortToggle when department header is clicked", async () => {
        const user = userEvent.setup();
        render(<EmployeeTable />);

        const sortButton = screen.getByText("department");
        await user.click(sortButton);

        expect(mockHandleSortToggle).toHaveBeenCalledTimes(1);
    });
});
