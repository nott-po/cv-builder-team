import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LanguageForm } from "@/components/features/languages/admin/LanguageForm";

jest.mock("next-intl");

const defaultProps = {
    submitLabel: "Create",
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    isSubmitting: false,
    error: null,
};

describe("LanguageForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders ISO2, name and native name inputs", () => {
        render(<LanguageForm {...defaultProps} />);

        expect(screen.getByPlaceholderText("iso2")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("native_name")).toBeInTheDocument();
    });

    it("renders submit and cancel buttons", () => {
        render(<LanguageForm {...defaultProps} />);

        expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "cancel" })).toBeInTheDocument();
    });

    it("validates that all fields are required", async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn();
        render(<LanguageForm {...defaultProps} onSubmit={onSubmit} />);

        await user.click(screen.getByRole("button", { name: "Create" }));

        await waitFor(() => {
            expect(onSubmit).not.toHaveBeenCalled();
        });
    });

    it("validates ISO2 code must be exactly 2 characters", async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn();
        render(<LanguageForm {...defaultProps} onSubmit={onSubmit} />);

        await user.type(screen.getByPlaceholderText("iso2"), "E");
        await user.type(screen.getByPlaceholderText("name"), "English");
        await user.type(screen.getByPlaceholderText("native_name"), "English");
        await user.click(screen.getByRole("button", { name: "Create" }));

        await waitFor(() => {
            expect(onSubmit).not.toHaveBeenCalled();
        });
    });

    it("converts ISO2 input to uppercase", async () => {
        const user = userEvent.setup();
        render(<LanguageForm {...defaultProps} />);

        await user.type(screen.getByPlaceholderText("iso2"), "en");

        expect(screen.getByPlaceholderText("iso2")).toHaveValue("EN");
    });

    it("submits form with valid data", async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn().mockResolvedValue(undefined);
        render(<LanguageForm {...defaultProps} onSubmit={onSubmit} />);

        await user.type(screen.getByPlaceholderText("iso2"), "EN");
        await user.type(screen.getByPlaceholderText("name"), "English");
        await user.type(screen.getByPlaceholderText("native_name"), "English");
        await user.click(screen.getByRole("button", { name: "Create" }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    iso2: "EN",
                    name: "English",
                    native_name: "English",
                }),
                expect.anything(),
            );
        });
    });

    it("calls onCancel when cancel button is clicked", async () => {
        const user = userEvent.setup();
        render(<LanguageForm {...defaultProps} />);

        await user.click(screen.getByRole("button", { name: "cancel" }));

        expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it("pre-fills fields with initial data", () => {
        render(
            <LanguageForm
                {...defaultProps}
                initialData={{ iso2: "PL", name: "Polish", native_name: "Polski" }}
            />,
        );

        expect(screen.getByPlaceholderText("iso2")).toHaveValue("PL");
        expect(screen.getByPlaceholderText("name")).toHaveValue("Polish");
        expect(screen.getByPlaceholderText("native_name")).toHaveValue("Polski");
    });

    it("displays error message when error prop is set", () => {
        render(<LanguageForm {...defaultProps} error="Language already exists" />);

        expect(screen.getByText("Language already exists")).toBeInTheDocument();
    });

    it("disables inputs when submitting", () => {
        render(<LanguageForm {...defaultProps} isSubmitting={true} />);

        expect(screen.getByPlaceholderText("iso2")).toBeDisabled();
        expect(screen.getByPlaceholderText("name")).toBeDisabled();
        expect(screen.getByPlaceholderText("native_name")).toBeDisabled();
        expect(screen.getByRole("button", { name: "Create" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "cancel" })).toBeDisabled();
    });
});
