import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AdminDeleteModal } from "@/components/shared/AdminDeleteModal";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

jest.mock("next-intl");

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

describe("AdminDeleteModal", () => {
    const mockHandleMutate = jest.fn();
    const mockHandleOpenChange = jest.fn();
    const mockOnOpenChange = jest.fn();

    const defaultProps = {
        open: true,
        item: { id: "dept-1", name: "Engineering" },
        onOpenChange: mockOnOpenChange,
        mutation: "mutation DeleteDept { ... }",
        buildVars: (id: string) => ({ department: { departmentId: id } }),
        queryKey: ["departments", "list"] as const,
        titleKey: "delete_department_title",
        confirmKey: "delete_department_confirm",
        errorKey: "delete_department_error",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: null,
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });
    });

    it("renders item name in confirmation message", () => {
        render(<AdminDeleteModal {...defaultProps} />);

        expect(screen.getByText("Engineering")).toBeInTheDocument();
    });

    it("renders title from translation key", () => {
        render(<AdminDeleteModal {...defaultProps} />);

        expect(screen.getByText("delete_department_title")).toBeInTheDocument();
    });

    it("calls handleMutate with item id on confirm", async () => {
        const user = userEvent.setup();
        render(<AdminDeleteModal {...defaultProps} />);

        await user.click(screen.getByRole("button", { name: "confirm" }));

        expect(mockHandleMutate).toHaveBeenCalledWith("dept-1", "delete_department_error");
    });

    it("does not call handleMutate when item is null", async () => {
        const user = userEvent.setup();
        render(<AdminDeleteModal {...defaultProps} item={null} />);

        await user.click(screen.getByRole("button", { name: "confirm" }));

        expect(mockHandleMutate).not.toHaveBeenCalled();
    });

    it("disables buttons while pending", () => {
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: true,
            submitError: null,
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });

        render(<AdminDeleteModal {...defaultProps} />);

        expect(screen.getByRole("button", { name: "cancel" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "confirm" })).toBeDisabled();
    });

    it("displays error message when submitError is set", () => {
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: "Cannot delete department with employees",
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });

        render(<AdminDeleteModal {...defaultProps} />);

        expect(screen.getByText("Cannot delete department with employees")).toBeInTheDocument();
    });
});
