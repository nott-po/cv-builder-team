import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EditUserModal } from "@/components/features/employees/admin/EditUserModal";
import { UserRole } from "@/lib/constants/roles";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

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

jest.mock("@tanstack/react-query", () => ({
    useQueryClient: () => ({ invalidateQueries: jest.fn() }),
    useQuery: () => ({ data: { departments: [], positions: [] } }),
}));

jest.mock("@/lib/hooks/useModalMutation", () => ({
    useModalMutation: jest.fn(),
}));

jest.mock("@/components/features/employees/admin/EmployeeForm", () => ({
    EmployeeForm: ({
        onCancel,
        onSubmit,
    }: {
        onCancel: () => void;
        onSubmit: (data: Record<string, string>) => void;
    }) => (
        <div data-testid="employee-form">
            <button onClick={onCancel}>Cancel</button>
            <button onClick={() => onSubmit({ first_name: "Jane" })}>Submit</button>
        </div>
    ),
}));

const mockEmployee = {
    id: "u1",
    email: "test@test.com",
    role: UserRole.Employee,
    department: { id: "d1" },
    position: { id: "p1" },
    profile: { first_name: "John", last_name: "Doe", avatar: null },
    department_name: "Eng",
    position_name: "Dev",
    created_at: "2024-01-01",
};

describe("EditUserModal", () => {
    const mockHandleMutate = jest.fn();
    const mockHandleOpenChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: null,
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });
    });

    it("renders dialog title when open with employee", () => {
        render(<EditUserModal open={true} employee={mockEmployee} onOpenChange={jest.fn()} />);

        expect(screen.getByText("edit_user_title")).toBeInTheDocument();
    });

    it("renders EmployeeForm when employee is provided", () => {
        render(<EditUserModal open={true} employee={mockEmployee} onOpenChange={jest.fn()} />);

        expect(screen.getByTestId("employee-form")).toBeInTheDocument();
    });

    it("does not render EmployeeForm when employee is null", () => {
        render(<EditUserModal open={true} employee={null} onOpenChange={jest.fn()} />);

        expect(screen.queryByTestId("employee-form")).not.toBeInTheDocument();
    });

    it("calls handleOpenChange(false) on cancel", async () => {
        const user = userEvent.setup();
        render(<EditUserModal open={true} employee={mockEmployee} onOpenChange={jest.fn()} />);

        await user.click(screen.getByText("Cancel"));

        expect(mockHandleOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls handleMutate with form data on submit", async () => {
        const user = userEvent.setup();
        render(<EditUserModal open={true} employee={mockEmployee} onOpenChange={jest.fn()} />);

        await user.click(screen.getByText("Submit"));

        expect(mockHandleMutate).toHaveBeenCalledWith(
            expect.objectContaining({ first_name: "Jane" }),
            expect.any(Function),
        );
    });
});
