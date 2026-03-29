import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CvForm } from "@/components/features/cvs/CVForm";

jest.mock("next-intl");

const defaultProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    isSubmitting: false,
    error: null,
};

describe("CvForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders name, education, and description fields", () => {
        render(<CvForm {...defaultProps} />);

        expect(screen.getByText("name")).toBeInTheDocument();
        expect(screen.getByText("education")).toBeInTheDocument();
        expect(screen.getByText("description")).toBeInTheDocument();
    });

    it("renders create and cancel buttons", () => {
        render(<CvForm {...defaultProps} />);

        expect(screen.getByRole("button", { name: "create" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "cancel" })).toBeInTheDocument();
    });

    it("calls onCancel when cancel button is clicked", async () => {
        const user = userEvent.setup();
        render(<CvForm {...defaultProps} />);

        await user.click(screen.getByRole("button", { name: "cancel" }));

        expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it("validates name is required", async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn();
        render(<CvForm {...defaultProps} onSubmit={onSubmit} />);

        const descriptionField = screen.getByRole("textbox", { name: /description/i });
        await user.type(descriptionField, "Some description");
        await user.click(screen.getByRole("button", { name: "create" }));

        await waitFor(() => {
            expect(onSubmit).not.toHaveBeenCalled();
        });
    });

    it("validates description is required", async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn();
        render(<CvForm {...defaultProps} onSubmit={onSubmit} />);

        const nameInput = screen.getByRole("textbox", { name: /^name$/i });
        await user.type(nameInput, "My CV");
        await user.click(screen.getByRole("button", { name: "create" }));

        await waitFor(() => {
            expect(onSubmit).not.toHaveBeenCalled();
        });
    });

    it("submits form with valid data", async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn().mockResolvedValue(undefined);
        render(<CvForm {...defaultProps} onSubmit={onSubmit} />);

        const nameInput = screen.getByRole("textbox", { name: /^name$/i });
        const descriptionField = screen.getByRole("textbox", { name: /description/i });

        await user.type(nameInput, "My CV");
        await user.type(descriptionField, "A great CV");
        await user.click(screen.getByRole("button", { name: "create" }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "My CV",
                    description: "A great CV",
                }),
                expect.anything(),
            );
        });
    });

    it("displays error message when error prop is set", () => {
        render(<CvForm {...defaultProps} error="Something went wrong" />);

        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("disables cancel button when isSubmitting", () => {
        render(<CvForm {...defaultProps} isSubmitting={true} />);

        expect(screen.getByRole("button", { name: "cancel" })).toBeDisabled();
    });

    it("disables create button when form is not dirty", () => {
        render(<CvForm {...defaultProps} />);

        expect(screen.getByRole("button", { name: "create" })).toBeDisabled();
    });
});
