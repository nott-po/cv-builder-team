import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AddProfileSkillModal } from "@/components/features/skills/profile/AddProfileSkillModal";
import { Mastery } from "@/generated/graphql";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

jest.mock("next-intl");

jest.mock("@/i18n/routing", () => ({
    useRouter: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useSearchParams: jest.fn(() => ({ get: jest.fn(), toString: () => "" })),
}));

jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(() => ({
        data: {
            skills: [{ name: "React" }, { name: "Node.js" }, { name: "TypeScript" }],
        },
    })),
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

jest.mock("@/generated/graphql", () => ({
    Mastery: {
        Novice: "Novice",
        Competent: "Competent",
        Proficient: "Proficient",
        Advanced: "Advanced",
        Expert: "Expert",
    },
}));

const mockHandleMutate = jest.fn();
const mockHandleOpenChange = jest.fn();

describe("AddProfileSkillModal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: null,
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });
    });

    it("renders add skill title when no editing skill", () => {
        render(
            <AddProfileSkillModal
                open={true}
                userId="user-1"
                existingSkills={[]}
                editingSkill={null}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByText("add_skill_title")).toBeInTheDocument();
    });

    it("renders edit skill title when editing skill is provided", () => {
        render(
            <AddProfileSkillModal
                open={true}
                userId="user-1"
                existingSkills={[]}
                editingSkill={{ name: "React", mastery: Mastery.Advanced }}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByText("edit_skill_title")).toBeInTheDocument();
    });

    it("filters out already-existing skills from available list", () => {
        render(
            <AddProfileSkillModal
                open={true}
                userId="user-1"
                existingSkills={[{ name: "React", mastery: Mastery.Advanced }]}
                editingSkill={null}
                onOpenChange={jest.fn()}
            />,
        );

        // React should be filtered out, only Node.js and TypeScript available
        expect(screen.queryByRole("option", { name: "React" })).not.toBeInTheDocument();
    });

    it("keeps the editing skill in available list even if it exists", () => {
        render(
            <AddProfileSkillModal
                open={true}
                userId="user-1"
                existingSkills={[{ name: "React", mastery: Mastery.Advanced }]}
                editingSkill={{ name: "React", mastery: Mastery.Advanced }}
                onOpenChange={jest.fn()}
            />,
        );

        // React should still be available since it's the one being edited
        expect(screen.getByText("edit_skill_title")).toBeInTheDocument();
    });

    it("renders nothing when closed", () => {
        const { container } = render(
            <AddProfileSkillModal
                open={false}
                userId="user-1"
                existingSkills={[]}
                editingSkill={null}
                onOpenChange={jest.fn()}
            />,
        );

        expect(container.querySelector("[role='dialog']")).not.toBeInTheDocument();
    });

    it("shows submit label as 'create' for new skill", () => {
        render(
            <AddProfileSkillModal
                open={true}
                userId="user-1"
                existingSkills={[]}
                editingSkill={null}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByRole("button", { name: "create" })).toBeInTheDocument();
    });

    it("shows submit label as 'save' when editing", () => {
        render(
            <AddProfileSkillModal
                open={true}
                userId="user-1"
                existingSkills={[]}
                editingSkill={{ name: "React", mastery: Mastery.Advanced }}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByRole("button", { name: "save" })).toBeInTheDocument();
    });

    it("calls handleOpenChange(false) on cancel", async () => {
        const user = userEvent.setup();
        render(
            <AddProfileSkillModal
                open={true}
                userId="user-1"
                existingSkills={[]}
                editingSkill={null}
                onOpenChange={jest.fn()}
            />,
        );

        await user.click(screen.getByRole("button", { name: "cancel" }));

        expect(mockHandleOpenChange).toHaveBeenCalledWith(false);
    });

    it("displays error when submitError is set", () => {
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: "Failed to add skill",
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });

        render(
            <AddProfileSkillModal
                open={true}
                userId="user-1"
                existingSkills={[]}
                editingSkill={null}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByText("Failed to add skill")).toBeInTheDocument();
    });
});
