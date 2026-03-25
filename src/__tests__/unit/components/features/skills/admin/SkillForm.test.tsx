import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SkillForm } from "@/components/features/skills/admin/SkillForm";

jest.mock("next-intl");

jest.mock("@/components/features/skills/admin/SkillCategorySelect", () => ({
    SkillCategorySelect: ({
        value,
        onChange,
        disabled,
    }: {
        value: string;
        onChange: (v: string) => void;
        disabled?: boolean;
    }) => (
        <select
            data-testid="category-select"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
        >
            <option value="">None</option>
            <option value="cat-1">Frontend</option>
        </select>
    ),
}));

const defaultProps = {
    submitLabel: "Create",
    categories: [],
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    isSubmitting: false,
    error: null,
};

describe("SkillForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders name input and category select", () => {
        render(<SkillForm {...defaultProps} />);

        expect(screen.getByPlaceholderText("name")).toBeInTheDocument();
        expect(screen.getByTestId("category-select")).toBeInTheDocument();
    });

    it("renders submit and cancel buttons", () => {
        render(<SkillForm {...defaultProps} />);

        expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "cancel" })).toBeInTheDocument();
    });

    it("validates name is required", async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn();
        render(<SkillForm {...defaultProps} onSubmit={onSubmit} />);

        await user.click(screen.getByRole("button", { name: "Create" }));

        await waitFor(() => {
            expect(onSubmit).not.toHaveBeenCalled();
        });
    });

    it("submits form with valid data", async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn().mockResolvedValue(undefined);
        render(<SkillForm {...defaultProps} onSubmit={onSubmit} />);

        await user.type(screen.getByPlaceholderText("name"), "TypeScript");
        await user.click(screen.getByRole("button", { name: "Create" }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                expect.objectContaining({ name: "TypeScript" }),
                expect.anything(),
            );
        });
    });

    it("calls onCancel when cancel button is clicked", async () => {
        const user = userEvent.setup();
        render(<SkillForm {...defaultProps} />);

        await user.click(screen.getByRole("button", { name: "cancel" }));

        expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it("pre-fills name with initial data", () => {
        render(
            <SkillForm {...defaultProps} initialData={{ name: "React", categoryId: "cat-1" }} />,
        );

        expect(screen.getByPlaceholderText("name")).toHaveValue("React");
    });

    it("displays error message when error prop is set", () => {
        render(<SkillForm {...defaultProps} error="Skill already exists" />);

        expect(screen.getByText("Skill already exists")).toBeInTheDocument();
    });

    it("disables inputs when submitting", () => {
        render(<SkillForm {...defaultProps} isSubmitting={true} />);

        expect(screen.getByPlaceholderText("name")).toBeDisabled();
        expect(screen.getByTestId("category-select")).toBeDisabled();
        expect(screen.getByRole("button", { name: "Create" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "cancel" })).toBeDisabled();
    });
});
