import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";

jest.mock("next-intl");

describe("DeleteConfirmModal", () => {
    const defaultProps = {
        open: true,
        onOpenChange: jest.fn(),
        title: "Delete item",
        description: "Are you sure?",
        onConfirm: jest.fn(),
        isPending: false,
        error: null,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders title and description when open", () => {
        render(<DeleteConfirmModal {...defaultProps} />);

        expect(screen.getByText("Delete item")).toBeInTheDocument();
        expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    });

    it("renders cancel and confirm buttons", () => {
        render(<DeleteConfirmModal {...defaultProps} />);

        expect(screen.getByRole("button", { name: "cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "confirm" })).toBeInTheDocument();
    });

    it("calls onConfirm when confirm button is clicked", async () => {
        const user = userEvent.setup();
        render(<DeleteConfirmModal {...defaultProps} />);

        await user.click(screen.getByRole("button", { name: "confirm" }));

        expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it("calls onOpenChange(false) when cancel button is clicked", async () => {
        const user = userEvent.setup();
        render(<DeleteConfirmModal {...defaultProps} />);

        await user.click(screen.getByRole("button", { name: "cancel" }));

        expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    });

    it("disables both buttons when isPending", () => {
        render(<DeleteConfirmModal {...defaultProps} isPending={true} />);

        expect(screen.getByRole("button", { name: "cancel" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "confirm" })).toBeDisabled();
    });

    it("displays error message when error is set", () => {
        render(<DeleteConfirmModal {...defaultProps} error="Delete failed" />);

        expect(screen.getByText("Delete failed")).toBeInTheDocument();
    });
});
