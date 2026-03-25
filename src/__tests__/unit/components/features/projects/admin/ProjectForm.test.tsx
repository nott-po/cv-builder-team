import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProjectForm } from "@/components/features/projects/admin/ProjectForm";

jest.mock("next-intl");

jest.mock("@/components/features/projects/admin/EnvironmentSelect", () => ({
    EnvironmentSelect: ({
        value,
        onChange,
        disabled,
    }: {
        value: string[];
        onChange: (v: string[]) => void;
        disabled?: boolean;
    }) => (
        <div data-testid="env-select">
            <span>{value.join(", ")}</span>
            <button
                type="button"
                onClick={() => onChange([...value, "React"])}
                disabled={disabled}
                data-testid="add-env"
            >
                Add
            </button>
        </div>
    ),
}));

const defaultProps = {
    submitLabel: "Create",
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    isSubmitting: false,
    error: null,
};

describe("ProjectForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders name, domain, date and description fields", () => {
        render(<ProjectForm {...defaultProps} />);

        expect(screen.getByPlaceholderText("name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("domain")).toBeInTheDocument();
        expect(screen.getByTestId("env-select")).toBeInTheDocument();
    });

    it("renders submit and cancel buttons", () => {
        render(<ProjectForm {...defaultProps} />);

        expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "cancel" })).toBeInTheDocument();
    });

    it("validates name is required", async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn();
        render(<ProjectForm {...defaultProps} onSubmit={onSubmit} />);

        await user.type(screen.getByPlaceholderText("domain"), "Tech");
        await user.click(screen.getByRole("button", { name: "Create" }));

        await waitFor(() => {
            expect(onSubmit).not.toHaveBeenCalled();
        });
    });

    it("validates domain is required", async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn();
        render(<ProjectForm {...defaultProps} onSubmit={onSubmit} />);

        await user.type(screen.getByPlaceholderText("name"), "Project");
        await user.click(screen.getByRole("button", { name: "Create" }));

        await waitFor(() => {
            expect(onSubmit).not.toHaveBeenCalled();
        });
    });

    it("calls onCancel when cancel button is clicked", async () => {
        const user = userEvent.setup();
        render(<ProjectForm {...defaultProps} />);

        await user.click(screen.getByRole("button", { name: "cancel" }));

        expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it("pre-fills fields with initial data", () => {
        render(
            <ProjectForm
                {...defaultProps}
                initialData={{
                    name: "CV Builder",
                    domain: "HR",
                    start_date: "2024-01-15",
                    end_date: "2024-06-30",
                    description: "A project",
                    environment: ["React"],
                }}
            />,
        );

        expect(screen.getByPlaceholderText("name")).toHaveValue("CV Builder");
        expect(screen.getByPlaceholderText("domain")).toHaveValue("HR");
    });

    it("displays error message when error prop is set", () => {
        render(<ProjectForm {...defaultProps} error="Failed to create project" />);

        expect(screen.getByText("Failed to create project")).toBeInTheDocument();
    });

    it("disables inputs and buttons when submitting", () => {
        render(<ProjectForm {...defaultProps} isSubmitting={true} />);

        expect(screen.getByPlaceholderText("name")).toBeDisabled();
        expect(screen.getByPlaceholderText("domain")).toBeDisabled();
        expect(screen.getByRole("button", { name: "Create" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "cancel" })).toBeDisabled();
    });
});
