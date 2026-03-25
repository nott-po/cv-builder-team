import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DeleteUserModal } from "@/components/features/employees/admin/DeleteUserModal";
import { UserRole } from "@/lib/constants/roles";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

jest.mock("next-intl");

jest.mock("@/i18n/routing", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
    useQueryClient: jest.fn(() => ({
        invalidateQueries: jest.fn(),
    })),
}));

jest.mock("@/lib/hooks/useModalMutation", () => ({
    useModalMutation: jest.fn(),
}));

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

const mockEmployee = {
    id: "emp-1",
    email: "john@test.com",
    role: UserRole.Employee,
    department_name: "Engineering",
    position_name: "Developer",
    profile: { first_name: "John", last_name: "Doe", avatar: null },
};

describe("DeleteUserModal", () => {
    const mockHandleMutate = jest.fn();
    const mockHandleOpenChange = jest.fn();
    const mockOnOpenChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: null,
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });
    });

    it("renders nothing when closed", () => {
        const { container } = render(
            <DeleteUserModal
                open={false}
                employee={mockEmployee}
                onOpenChange={mockOnOpenChange}
            />,
        );

        expect(container.querySelector("[role='dialog']")).not.toBeInTheDocument();
    });

    it("renders employee full name in confirmation message", () => {
        render(
            <DeleteUserModal open={true} employee={mockEmployee} onOpenChange={mockOnOpenChange} />,
        );

        expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("falls back to email when name is missing", () => {
        const noNameEmployee = {
            ...mockEmployee,
            profile: { first_name: null, last_name: null, avatar: null },
        };

        render(
            <DeleteUserModal
                open={true}
                employee={noNameEmployee}
                onOpenChange={mockOnOpenChange}
            />,
        );

        expect(screen.getByText("john@test.com")).toBeInTheDocument();
    });

    it("calls handleMutate with employee id on confirm", async () => {
        const user = userEvent.setup();
        render(
            <DeleteUserModal open={true} employee={mockEmployee} onOpenChange={mockOnOpenChange} />,
        );

        await user.click(screen.getByRole("button", { name: "confirm" }));

        expect(mockHandleMutate).toHaveBeenCalledWith("emp-1", expect.any(String));
    });

    it("does not call handleMutate when employee is null", async () => {
        const user = userEvent.setup();
        render(<DeleteUserModal open={true} employee={null} onOpenChange={mockOnOpenChange} />);

        await user.click(screen.getByRole("button", { name: "confirm" }));

        expect(mockHandleMutate).not.toHaveBeenCalled();
    });

    it("displays error message when submitError is set", () => {
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: "Delete failed",
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });

        render(
            <DeleteUserModal open={true} employee={mockEmployee} onOpenChange={mockOnOpenChange} />,
        );

        expect(screen.getByText("Delete failed")).toBeInTheDocument();
    });

    it("disables buttons while mutation is pending", () => {
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: true,
            submitError: null,
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });

        render(
            <DeleteUserModal open={true} employee={mockEmployee} onOpenChange={mockOnOpenChange} />,
        );

        expect(screen.getByRole("button", { name: "cancel" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "confirm" })).toBeDisabled();
    });
});
