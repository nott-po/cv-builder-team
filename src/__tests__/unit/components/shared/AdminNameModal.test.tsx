import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AdminNameModal } from "@/components/shared/AdminNameModal";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

jest.mock("next-intl");

jest.mock("@/lib/hooks/useModalMutation", () => ({
    useModalMutation: jest.fn(),
}));

describe("AdminNameModal", () => {
    const mockHandleMutate = jest.fn();
    const mockHandleOpenChange = jest.fn();
    const mockOnOpenChange = jest.fn();
    const mockMutationFn = jest.fn();
    const mockOnSuccess = jest.fn();

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
            <AdminNameModal
                open={false}
                onOpenChange={mockOnOpenChange}
                title="Create Department"
                errorMessage="Error"
                mutationFn={mockMutationFn}
                onSuccess={mockOnSuccess}
            />,
        );

        expect(container.querySelector("[role='dialog']")).not.toBeInTheDocument();
    });

    it("renders dialog with title when open", () => {
        render(
            <AdminNameModal
                open={true}
                onOpenChange={mockOnOpenChange}
                title="Create Department"
                errorMessage="Error"
                mutationFn={mockMutationFn}
                onSuccess={mockOnSuccess}
            />,
        );

        expect(screen.getByText("Create Department")).toBeInTheDocument();
    });

    it("renders create button in create mode (no entity)", () => {
        render(
            <AdminNameModal
                open={true}
                onOpenChange={mockOnOpenChange}
                title="Create"
                errorMessage="Error"
                mutationFn={mockMutationFn}
                onSuccess={mockOnSuccess}
            />,
        );

        expect(screen.getByRole("button", { name: "create" })).toBeInTheDocument();
    });

    it("renders save button in edit mode (entity provided)", () => {
        render(
            <AdminNameModal
                open={true}
                onOpenChange={mockOnOpenChange}
                title="Edit"
                errorMessage="Error"
                entity={{ id: "1", name: "Engineering" }}
                mutationFn={mockMutationFn}
                onSuccess={mockOnSuccess}
            />,
        );

        expect(screen.getByRole("button", { name: "save" })).toBeInTheDocument();
    });

    it("pre-fills input with entity name in edit mode", () => {
        render(
            <AdminNameModal
                open={true}
                onOpenChange={mockOnOpenChange}
                title="Edit"
                errorMessage="Error"
                entity={{ id: "1", name: "Engineering" }}
                mutationFn={mockMutationFn}
                onSuccess={mockOnSuccess}
            />,
        );

        expect(screen.getByDisplayValue("Engineering")).toBeInTheDocument();
    });

    it("calls handleMutate on form submit", async () => {
        const user = userEvent.setup();
        render(
            <AdminNameModal
                open={true}
                onOpenChange={mockOnOpenChange}
                title="Create"
                errorMessage="Creation failed"
                mutationFn={mockMutationFn}
                onSuccess={mockOnSuccess}
            />,
        );

        await user.type(screen.getByPlaceholderText("name"), "New Department");
        await user.click(screen.getByRole("button", { name: "create" }));

        expect(mockHandleMutate).toHaveBeenCalledWith(
            expect.objectContaining({ name: "New Department" }),
            "Creation failed",
        );
    });

    it("calls handleOpenChange on cancel", async () => {
        const user = userEvent.setup();
        render(
            <AdminNameModal
                open={true}
                onOpenChange={mockOnOpenChange}
                title="Create"
                errorMessage="Error"
                mutationFn={mockMutationFn}
                onSuccess={mockOnSuccess}
            />,
        );

        await user.click(screen.getByRole("button", { name: "cancel" }));

        expect(mockHandleOpenChange).toHaveBeenCalledWith(false);
    });

    it("displays submit error when present", () => {
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: "Name already exists",
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });

        render(
            <AdminNameModal
                open={true}
                onOpenChange={mockOnOpenChange}
                title="Create"
                errorMessage="Error"
                mutationFn={mockMutationFn}
                onSuccess={mockOnSuccess}
            />,
        );

        expect(screen.getByText("Name already exists")).toBeInTheDocument();
    });
});
