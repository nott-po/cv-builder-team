import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CreateSkillModal } from "@/components/features/skills/admin/CreateSkillModal";
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
            <button onClick={() => onSubmit({ name: "React", categoryId: "c1" })}>Submit</button>
        </div>
    ),
}));

describe("CreateSkillModal", () => {
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

    it("renders dialog title when open", () => {
        render(<CreateSkillModal open={true} onOpenChange={jest.fn()} />);

        expect(screen.getByText("create_skill_title")).toBeInTheDocument();
    });

    it("renders SkillForm inside the dialog", () => {
        render(<CreateSkillModal open={true} onOpenChange={jest.fn()} />);

        expect(screen.getByTestId("skill-form")).toBeInTheDocument();
    });

    it("calls handleOpenChange(false) on cancel", async () => {
        const user = userEvent.setup();
        render(<CreateSkillModal open={true} onOpenChange={jest.fn()} />);

        await user.click(screen.getByText("Cancel"));

        expect(mockHandleOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls handleMutate on form submit", async () => {
        const user = userEvent.setup();
        render(<CreateSkillModal open={true} onOpenChange={jest.fn()} />);

        await user.click(screen.getByText("Submit"));

        expect(mockHandleMutate).toHaveBeenCalled();
    });
});
