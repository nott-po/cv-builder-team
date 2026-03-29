import { render, screen } from "@testing-library/react";

import { AddCVSkillModal } from "@/components/shared/AddCVSkillModal";

jest.mock("next-intl");
jest.mock("@/i18n/routing", () => ({
    useRouter: () => ({ push: jest.fn() }),
    Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
        <a href={href}>{children}</a>
    ),
}));
jest.mock("next/navigation", () => ({
    useSearchParams: () => new URLSearchParams(),
}));

const mockHandleMutate = jest.fn();
const mockHandleOpenChange = jest.fn();

jest.mock("@/lib/hooks/useModalMutation", () => ({
    useModalMutation: () => ({
        isPending: false,
        submitError: null,
        handleOpenChange: mockHandleOpenChange,
        handleMutate: mockHandleMutate,
    }),
}));

jest.mock("@tanstack/react-query", () => ({
    useQuery: () => ({
        data: {
            skills: [
                { id: "s1", name: "React", category_name: "Frontend", category_parent_name: null },
                { id: "s2", name: "Node.js", category_name: "Backend", category_parent_name: null },
                { id: "s3", name: "Docker", category_name: "DevOps", category_parent_name: null },
            ],
        },
    }),
    useQueryClient: () => ({
        invalidateQueries: jest.fn(),
    }),
}));

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

let capturedAvailableSkills: { name: string }[] = [];

jest.mock("@/components/features/skills/profile/ProfileSkillForm", () => ({
    ProfileSkillForm: ({
        availableSkills,
        submitLabel,
        onCancel,
        readOnly,
    }: {
        availableSkills: { name: string }[];
        submitLabel: string;
        onCancel: () => void;
        readOnly?: boolean;
    }) => {
        capturedAvailableSkills = availableSkills;
        return (
            <div>
                <span data-testid="submit-label">{submitLabel}</span>
                <span data-testid="read-only">{String(readOnly ?? false)}</span>
                <span data-testid="skill-count">{availableSkills.length}</span>
                <button onClick={onCancel}>cancel</button>
            </div>
        );
    },
}));

describe("AddCVSkillModal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        capturedAvailableSkills = [];
    });

    it("renders add skill title when no editing skill", () => {
        render(
            <AddCVSkillModal
                open={true}
                cvId="cv-1"
                existingSkills={[]}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByText("add_skill")).toBeInTheDocument();
    });

    it("renders edit skill title when editing skill is provided", () => {
        render(
            <AddCVSkillModal
                open={true}
                cvId="cv-1"
                existingSkills={[]}
                editingSkill={{ name: "React", mastery: "Novice" }}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByText("edit_skill_title")).toBeInTheDocument();
    });

    it("shows create label when adding new skill", () => {
        render(
            <AddCVSkillModal
                open={true}
                cvId="cv-1"
                existingSkills={[]}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByTestId("submit-label")).toHaveTextContent("create");
    });

    it("shows save label when editing skill", () => {
        render(
            <AddCVSkillModal
                open={true}
                cvId="cv-1"
                existingSkills={[]}
                editingSkill={{ name: "React", mastery: "Novice" }}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByTestId("submit-label")).toHaveTextContent("save");
    });

    it("does not render when closed", () => {
        render(
            <AddCVSkillModal
                open={false}
                cvId="cv-1"
                existingSkills={[]}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.queryByText("add_skill")).not.toBeInTheDocument();
    });

    it("filters out existing skills from available options", () => {
        render(
            <AddCVSkillModal
                open={true}
                cvId="cv-1"
                existingSkills={[{ name: "React", mastery: "Novice" }]}
                onOpenChange={jest.fn()}
            />,
        );

        const skillNames = capturedAvailableSkills.map((s) => s.name);
        expect(skillNames).toContain("Node.js");
        expect(skillNames).toContain("Docker");
        expect(skillNames).not.toContain("React");
    });

    it("keeps the editing skill in available options even if it exists", () => {
        render(
            <AddCVSkillModal
                open={true}
                cvId="cv-1"
                existingSkills={[{ name: "React", mastery: "Novice" }]}
                editingSkill={{ name: "React", mastery: "Novice" }}
                onOpenChange={jest.fn()}
            />,
        );

        const skillNames = capturedAvailableSkills.map((s) => s.name);
        expect(skillNames).toContain("React");
        expect(skillNames).toContain("Node.js");
        expect(skillNames).toContain("Docker");
    });

    it("sets readOnly to true when editing", () => {
        render(
            <AddCVSkillModal
                open={true}
                cvId="cv-1"
                existingSkills={[]}
                editingSkill={{ name: "React", mastery: "Novice" }}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByTestId("read-only")).toHaveTextContent("true");
    });
});
