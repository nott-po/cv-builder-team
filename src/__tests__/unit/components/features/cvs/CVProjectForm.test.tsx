import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CVProjectForm } from "@/components/features/cvs/CVProjectForm";

jest.mock("next-intl");

jest.mock("@/components/ui/date-input", () => ({
    DateInput: ({
        label,
        value,
        onChange,
        disabled,
    }: {
        label: string;
        value: string;
        onChange: (e: { target: { value: string } }) => void;
        disabled?: boolean;
    }) => (
        <input
            aria-label={label}
            type="date"
            value={value}
            onChange={onChange}
            disabled={disabled}
        />
    ),
}));

const availableProjects = [
    { id: "proj-1", name: "Project Alpha", domain: "Web", environment: ["React", "Node.js"] },
    { id: "proj-2", name: "Project Beta", domain: "Mobile", environment: ["Flutter"] },
];

const defaultProps = {
    mode: "add" as const,
    defaultValues: {
        projectId: "",
        start_date: "",
        end_date: "",
        roles: "",
        responsibilities: "",
    },
    availableProjects,
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    isSubmitting: false,
    error: null,
};

describe("CVProjectForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders all form fields", () => {
        render(<CVProjectForm {...defaultProps} />);

        expect(screen.getByText("project")).toBeInTheDocument();
        expect(screen.getByText("domain")).toBeInTheDocument();
        expect(screen.getByText("roles")).toBeInTheDocument();
        expect(screen.getByText("responsibilities")).toBeInTheDocument();
        expect(screen.getByText("environment")).toBeInTheDocument();
    });

    it("renders add and cancel buttons in add mode", () => {
        render(<CVProjectForm {...defaultProps} />);

        expect(screen.getByRole("button", { name: "add" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "cancel" })).toBeInTheDocument();
    });

    it("renders update button in edit mode", () => {
        render(<CVProjectForm {...defaultProps} mode="edit" />);

        expect(screen.getByRole("button", { name: "update" })).toBeInTheDocument();
    });

    it("calls onCancel when cancel button is clicked", async () => {
        const user = userEvent.setup();
        render(<CVProjectForm {...defaultProps} />);

        await user.click(screen.getByRole("button", { name: "cancel" }));

        expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it("displays error message when error prop is set", () => {
        render(<CVProjectForm {...defaultProps} error="Failed to add project" />);

        expect(screen.getByText("Failed to add project")).toBeInTheDocument();
    });

    it("disables cancel button when isSubmitting", () => {
        render(<CVProjectForm {...defaultProps} isSubmitting={true} />);

        expect(screen.getByRole("button", { name: "cancel" })).toBeDisabled();
    });

    it("disables add button when form is not dirty", () => {
        render(<CVProjectForm {...defaultProps} />);

        expect(screen.getByRole("button", { name: "add" })).toBeDisabled();
    });

    it("submits form with valid data", async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn().mockResolvedValue(undefined);
        render(
            <CVProjectForm
                {...defaultProps}
                onSubmit={onSubmit}
                defaultValues={{
                    projectId: "proj-1",
                    start_date: "2024-01-01",
                    end_date: "",
                    roles: "",
                    responsibilities: "",
                }}
            />,
        );

        const rolesLabel = screen.getByText("roles");
        const rolesInput = rolesLabel.closest("div")!.querySelector("input") as HTMLInputElement;
        const responsibilitiesLabel = screen.getByText("responsibilities");
        const responsibilitiesInput = responsibilitiesLabel
            .closest("div")!
            .querySelector("textarea") as HTMLTextAreaElement;

        await user.type(rolesInput, "Developer");
        await user.type(responsibilitiesInput, "Backend development");
        await user.click(screen.getByRole("button", { name: "add" }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    projectId: "proj-1",
                    start_date: "2024-01-01",
                    roles: "Developer",
                    responsibilities: "Backend development",
                }),
                expect.anything(),
            );
        });
    });

    it("does not submit when required fields are missing", async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn();
        render(
            <CVProjectForm
                {...defaultProps}
                onSubmit={onSubmit}
                defaultValues={{
                    projectId: "proj-1",
                    start_date: "",
                    end_date: "",
                    roles: "",
                    responsibilities: "",
                }}
            />,
        );

        const rolesLabel = screen.getByText("roles");
        const rolesInput = rolesLabel.closest("div")!.querySelector("input") as HTMLInputElement;
        await user.type(rolesInput, "Developer");
        await user.click(screen.getByRole("button", { name: "add" }));

        await waitFor(() => {
            expect(onSubmit).not.toHaveBeenCalled();
        });
    });
});
