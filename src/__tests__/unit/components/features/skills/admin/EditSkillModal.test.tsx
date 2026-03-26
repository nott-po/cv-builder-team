import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EditSkillModal } from "@/components/features/skills/admin/EditSkillModal";
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
    useQuery: () => ({ data: { skillCategories: [] } }),
}));

jest.mock("@/lib/hooks/useModalMutation", () => ({
    useModalMutation: jest.fn(),
}));

jest.mock("@/components/features/skills/admin/SkillForm", () => ({
    SkillForm: ({
        onCancel,
        onSubmit,
    }: {
        onCancel: () => void;
        onSubmit: (data: Record<string, string>) => void;
    }) => (
        <div data-testid="skill-form">
            <button onClick={onCancel}>Cancel</button>
            <button onClick={() => onSubmit({ name: "Vue", categoryId: "c2" })}>Submit</button>
        </div>
    ),
}));

const mockSkill = {
    id: "s1",
    name: "React",
    category_name: "Frontend",
    category_parent_name: "Software",
    category: { id: "c1", name: "Frontend" },
};

describe("EditSkillModal", () => {
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

    it("renders dialog title when open with skill", () => {
        render(<EditSkillModal open={true} skill={mockSkill} onOpenChange={jest.fn()} />);

        expect(screen.getByText("edit_skill_title")).toBeInTheDocument();
    });

    it("renders SkillForm when skill is provided", () => {
        render(<EditSkillModal open={true} skill={mockSkill} onOpenChange={jest.fn()} />);

        expect(screen.getByTestId("skill-form")).toBeInTheDocument();
    });

    it("does not render SkillForm when skill is null", () => {
        render(<EditSkillModal open={true} skill={null} onOpenChange={jest.fn()} />);

        expect(screen.queryByTestId("skill-form")).not.toBeInTheDocument();
    });

    it("calls handleOpenChange(false) on cancel", async () => {
        const user = userEvent.setup();
        render(<EditSkillModal open={true} skill={mockSkill} onOpenChange={jest.fn()} />);

        await user.click(screen.getByText("Cancel"));

        expect(mockHandleOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls handleMutate on form submit", async () => {
        const user = userEvent.setup();
        render(<EditSkillModal open={true} skill={mockSkill} onOpenChange={jest.fn()} />);

        await user.click(screen.getByText("Submit"));

        expect(mockHandleMutate).toHaveBeenCalled();
    });
});
