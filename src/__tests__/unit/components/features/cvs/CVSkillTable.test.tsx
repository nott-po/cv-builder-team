import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CVSkillTable } from "@/components/features/cvs/CVSkillTable";

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

const mockCvData = {
    id: "cv-1",
    created_at: "2024-01-01",
    name: "Test CV",
    education: "MIT",
    description: "A test CV",
    skills: [
        { name: "React", mastery: "Skillful" },
        { name: "Node.js", mastery: "Expert" },
        { name: "Docker", mastery: "Novice" },
    ],
    languages: [],
    projects: [],
};

let useCvReturn = {
    cv: mockCvData as typeof mockCvData | undefined,
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
};

jest.mock("@/lib/hooks/useCV", () => ({
    useCv: () => useCvReturn,
    cvDetailKey: (id: string) => ["cv", "detail", id],
}));

jest.mock("@tanstack/react-query", () => ({
    useQuery: () => ({
        data: {
            skills: [
                { id: "s1", name: "React", category_name: "Frontend", category_parent_name: null },
                { id: "s2", name: "Node.js", category_name: "Backend", category_parent_name: null },
                { id: "s3", name: "Docker", category_name: "DevOps", category_parent_name: null },
                { id: "s4", name: "Python", category_name: "Backend", category_parent_name: null },
            ],
        },
        isLoading: false,
    }),
    useQueryClient: () => ({ invalidateQueries: jest.fn() }),
    useMutation: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

jest.mock("@/components/shared/AddCVSkillModal", () => ({
    AddCVSkillModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="add-skill-modal">Add Skill Modal</div> : null,
}));

jest.mock("@/components/shared/RemoveProfileItemModal", () => ({
    RemoveProfileItemModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="remove-skill-modal">Remove Skill Modal</div> : null,
}));

jest.mock("@/components/shared/RowActionsDropdown", () => ({
    RowActionsDropdown: ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
        <div data-testid="row-actions">
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>
        </div>
    ),
}));

jest.mock("@/components/shared/ErrorMessage", () => ({
    ErrorMessage: ({ message }: { message: string }) => (
        <div data-testid="error-message">{message}</div>
    ),
}));

jest.mock("@/components/features/skills/profile/ProfileSkillTableSkeleton", () => ({
    ProfileSkillTableSkeleton: () => <div data-testid="skeleton" />,
}));

describe("CVSkillTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useCvReturn = {
            cv: mockCvData,
            isLoading: false,
            isError: false,
            refetch: jest.fn(),
        };
    });

    it("renders skill names", () => {
        render(<CVSkillTable cvId="cv-1" />);

        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("Node.js")).toBeInTheDocument();
        expect(screen.getByText("Docker")).toBeInTheDocument();
    });

    it("groups skills by category", () => {
        render(<CVSkillTable cvId="cv-1" />);

        expect(screen.getByText("Frontend")).toBeInTheDocument();
        expect(screen.getByText("Backend")).toBeInTheDocument();
        expect(screen.getByText("DevOps")).toBeInTheDocument();
    });

    it("shows empty state when no skills", () => {
        useCvReturn = {
            cv: { ...mockCvData, skills: [] },
            isLoading: false,
            isError: false,
            refetch: jest.fn(),
        };

        render(<CVSkillTable cvId="cv-1" />);

        expect(screen.getByText("no_skills")).toBeInTheDocument();
    });

    it("shows add skill button when not read-only", () => {
        render(<CVSkillTable cvId="cv-1" />);

        expect(screen.getByText("add_skill")).toBeInTheDocument();
    });

    it("hides add skill button in read-only mode", () => {
        render(<CVSkillTable cvId="cv-1" readOnly={true} />);

        expect(screen.queryByText("add_skill")).not.toBeInTheDocument();
    });

    it("hides row actions in read-only mode", () => {
        render(<CVSkillTable cvId="cv-1" readOnly={true} />);

        expect(screen.queryAllByTestId("row-actions")).toHaveLength(0);
    });

    it("shows row actions when not read-only", () => {
        render(<CVSkillTable cvId="cv-1" />);

        expect(screen.getAllByTestId("row-actions").length).toBeGreaterThan(0);
    });

    it("shows error message on fetch error", () => {
        useCvReturn = {
            cv: undefined,
            isLoading: false,
            isError: true,
            refetch: jest.fn(),
        };

        render(<CVSkillTable cvId="cv-1" />);

        expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });

    it("shows skeleton when loading", () => {
        useCvReturn = {
            cv: undefined,
            isLoading: true,
            isError: false,
            refetch: jest.fn(),
        };

        render(<CVSkillTable cvId="cv-1" />);

        expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });

    it("opens add skill modal when add button is clicked", async () => {
        const user = userEvent.setup();
        render(<CVSkillTable cvId="cv-1" />);

        await user.click(screen.getByText("add_skill"));

        expect(screen.getByTestId("add-skill-modal")).toBeInTheDocument();
    });
});
