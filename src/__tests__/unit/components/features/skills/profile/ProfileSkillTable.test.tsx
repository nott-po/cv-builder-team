import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProfileSkillTable } from "@/components/features/skills/profile/ProfileSkillTable";
import { useProfileSkills } from "@/lib/hooks/useProfileSkills";

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
            skills: [
                {
                    name: "React",
                    category_name: "Frontend",
                    category_parent_name: "Development",
                },
                {
                    name: "Node.js",
                    category_name: "Backend",
                    category_parent_name: "Development",
                },
                { name: "Git", category_name: null, category_parent_name: null },
            ],
        },
        isLoading: false,
    })),
}));

jest.mock("@/lib/hooks/useProfileSkills", () => ({
    useProfileSkills: jest.fn(),
    profileSkillsKey: (id: string) => ["profile", id, "skills"],
}));

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

jest.mock("@/components/features/skills/profile/ProfileSkillTableSkeleton", () => ({
    ProfileSkillTableSkeleton: () => <div data-testid="skeleton" />,
}));

jest.mock("@/components/shared/ErrorMessage", () => ({
    ErrorMessage: ({ message }: { message: string }) => <div data-testid="error">{message}</div>,
}));

jest.mock("@/components/features/skills/profile/AddProfileSkillModal", () => ({
    AddProfileSkillModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="add-modal">Add</div> : null,
}));

jest.mock("@/components/shared/RemoveProfileItemModal", () => ({
    RemoveProfileItemModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="remove-modal">Remove</div> : null,
}));

const mockSkills = [
    { name: "React", mastery: "Advanced" },
    { name: "Node.js", mastery: "Competent" },
];

describe("ProfileSkillTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useProfileSkills as jest.Mock).mockReturnValue({
            skills: mockSkills,
            isLoading: false,
            isError: false,
        });
    });

    it("renders skill names", () => {
        render(<ProfileSkillTable userId="user-1" />);

        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("Node.js")).toBeInTheDocument();
    });

    it("renders loading skeleton when loading", () => {
        (useProfileSkills as jest.Mock).mockReturnValue({
            skills: [],
            isLoading: true,
            isError: false,
        });

        render(<ProfileSkillTable userId="user-1" />);

        expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });

    it("renders error message on error", () => {
        (useProfileSkills as jest.Mock).mockReturnValue({
            skills: [],
            isLoading: false,
            isError: true,
        });

        render(<ProfileSkillTable userId="user-1" />);

        expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    it("renders empty state when no skills", () => {
        (useProfileSkills as jest.Mock).mockReturnValue({
            skills: [],
            isLoading: false,
            isError: false,
        });

        render(<ProfileSkillTable userId="user-1" />);

        expect(screen.getByText("no_skills")).toBeInTheDocument();
    });

    it("renders add skill button when not read-only", () => {
        render(<ProfileSkillTable userId="user-1" />);

        expect(screen.getByText("add_skill")).toBeInTheDocument();
    });

    it("does not render add button in read-only mode", () => {
        render(<ProfileSkillTable userId="user-1" readOnly />);

        expect(screen.queryByText("add_skill")).not.toBeInTheDocument();
    });

    it("does not render row action dropdowns in read-only mode", () => {
        render(<ProfileSkillTable userId="user-1" readOnly />);

        expect(screen.queryByRole("button", { name: "skill_actions" })).not.toBeInTheDocument();
    });

    it("renders row action dropdowns when not read-only", () => {
        render(<ProfileSkillTable userId="user-1" />);

        const actionButtons = screen.getAllByRole("button", { name: "skill_actions" });
        expect(actionButtons).toHaveLength(2);
    });

    it("opens add modal when add button is clicked", async () => {
        const user = userEvent.setup();
        render(<ProfileSkillTable userId="user-1" />);

        await user.click(screen.getByText("add_skill"));

        expect(screen.getByTestId("add-modal")).toBeInTheDocument();
    });

    it("opens remove modal when delete action is triggered", async () => {
        const user = userEvent.setup();
        render(<ProfileSkillTable userId="user-1" />);

        await user.click(screen.getAllByRole("button", { name: "skill_actions" })[0]);
        await user.click(screen.getByText("delete"));

        expect(screen.getByTestId("remove-modal")).toBeInTheDocument();
    });

    it("opens add modal in edit mode when edit action is triggered", async () => {
        const user = userEvent.setup();
        render(<ProfileSkillTable userId="user-1" />);

        await user.click(screen.getAllByRole("button", { name: "skill_actions" })[0]);
        await user.click(screen.getByText("edit"));

        expect(screen.getByTestId("add-modal")).toBeInTheDocument();
    });

    it("passes userId to useProfileSkills", () => {
        render(<ProfileSkillTable userId="user-42" />);

        expect(useProfileSkills).toHaveBeenCalledWith("user-42");
    });
});
