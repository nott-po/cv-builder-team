import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AdminEmployeeTable } from "@/components/features/employees/admin/AdminEmployeeTable";
import { UserRole } from "@/lib/constants/roles";
import { useEmployeeTable } from "@/lib/hooks/useEmployeeTable";
import type { TableState } from "@/types/table";

jest.mock("next-intl");

jest.mock("@/components/features/employees/user/EmployeeTableSkeleton", () => ({
    EmployeeTableSkeleton: () => <div data-testid="skeleton" />,
}));

jest.mock("@/components/shared/ErrorMessage", () => ({
    ErrorMessage: () => <div data-testid="error" />,
}));

jest.mock("@/lib/hooks/useEmployeeTable", () => ({
    useEmployeeTable: jest.fn(),
}));

jest.mock("@/components/features/employees/admin/CreateUserModal", () => ({
    CreateUserModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="create-modal">Create Modal</div> : null,
}));

jest.mock("@/components/features/employees/admin/EditUserModal", () => ({
    EditUserModal: ({ open, employee }: { open: boolean; employee: unknown }) =>
        open ? <div data-testid="edit-modal">{JSON.stringify(employee)}</div> : null,
}));

jest.mock("@/components/features/employees/admin/DeleteUserModal", () => ({
    DeleteUserModal: ({ open, employee }: { open: boolean; employee: unknown }) =>
        open ? <div data-testid="delete-modal">{JSON.stringify(employee)}</div> : null,
}));

const noop = jest.fn();

const makeState = (overrides: Partial<TableState> = {}): TableState => ({
    isLoading: false,
    isError: false,
    isEmpty: true,
    search: "",
    onSearchChange: noop,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    onPageChange: noop,
    onPageSizeChange: noop,
    ...overrides,
});

const mockEmployee = {
    id: "emp-1",
    email: "john@test.com",
    role: UserRole.Employee,
    department_name: "Engineering",
    department: { id: "dept-1" },
    position_name: "Developer",
    position: { id: "pos-1" },
    profile: { first_name: "John", last_name: "Doe", avatar: null },
};

describe("AdminEmployeeTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useEmployeeTable as jest.Mock).mockReturnValue({
            state: makeState({ isEmpty: false }),
            paginatedEmployees: [mockEmployee],
            sortDir: "desc",
            handleSortToggle: noop,
            handleRowClick: noop,
        });
    });

    it("passes admin basePath to EmployeeTable", () => {
        render(<AdminEmployeeTable />);

        expect(useEmployeeTable).toHaveBeenCalledWith("/admin/employees");
    });

    it("opens create modal when create button is clicked", async () => {
        const user = userEvent.setup();
        render(<AdminEmployeeTable />);

        expect(screen.queryByTestId("create-modal")).not.toBeInTheDocument();

        await user.click(screen.getByText("create_user"));

        expect(screen.getByTestId("create-modal")).toBeInTheDocument();
    });

    it("renders row action buttons for each employee", () => {
        render(<AdminEmployeeTable />);

        expect(screen.getByRole("button", { name: "employee_actions" })).toBeInTheDocument();
    });

    it("opens edit modal with employee data when edit action is triggered", async () => {
        const user = userEvent.setup();
        render(<AdminEmployeeTable />);

        await user.click(screen.getByRole("button", { name: "employee_actions" }));
        await user.click(screen.getByText("edit"));

        const editModal = screen.getByTestId("edit-modal");
        expect(editModal).toBeInTheDocument();
        expect(editModal.textContent).toContain("emp-1");
    });

    it("opens delete modal with employee data when delete action is triggered", async () => {
        const user = userEvent.setup();
        render(<AdminEmployeeTable />);

        await user.click(screen.getByRole("button", { name: "employee_actions" }));
        await user.click(screen.getByText("delete"));

        const deleteModal = screen.getByTestId("delete-modal");
        expect(deleteModal).toBeInTheDocument();
        expect(deleteModal.textContent).toContain("emp-1");
    });

    it("renders error message when data fails to load", () => {
        (useEmployeeTable as jest.Mock).mockReturnValue({
            state: makeState({ isError: true }),
            paginatedEmployees: [],
            sortDir: "desc",
            handleSortToggle: noop,
            handleRowClick: noop,
        });

        render(<AdminEmployeeTable />);

        expect(screen.getByTestId("error")).toBeInTheDocument();
    });
});
