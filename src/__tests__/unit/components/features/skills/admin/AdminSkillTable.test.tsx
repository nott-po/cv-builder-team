import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AdminSkillTable } from "@/components/features/skills/admin/AdminSkillTable";
import { useSkillTable } from "@/lib/hooks/useSkillTable";
import type { TableState } from "@/types/table";

jest.mock("next-intl");

jest.mock("@/lib/hooks/useSkillTable", () => ({
    useSkillTable: jest.fn(),
    skillsListKey: () => ["skills", "list"],
}));

jest.mock("@/components/features/skills/admin/SkillTableSkeleton", () => ({
    SkillTableSkeleton: () => <div data-testid="skeleton" />,
}));

jest.mock("@/components/shared/ErrorMessage", () => ({
    ErrorMessage: () => <div data-testid="error" />,
}));

jest.mock("@/components/features/skills/admin/CreateSkillModal", () => ({
    CreateSkillModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="create-modal">Create</div> : null,
}));

jest.mock("@/components/features/skills/admin/EditSkillModal", () => ({
    EditSkillModal: ({ open, skill }: { open: boolean; skill: unknown }) =>
        open ? <div data-testid="edit-modal">{JSON.stringify(skill)}</div> : null,
}));

jest.mock("@/components/shared/AdminDeleteModal", () => ({
    AdminDeleteModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="delete-modal">Delete</div> : null,
}));

const noop = jest.fn();

const makeState = (overrides: Partial<TableState> = {}): TableState => ({
    isLoading: false,
    isError: false,
    isEmpty: false,
    search: "",
    onSearchChange: noop,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    onPageChange: noop,
    onPageSizeChange: noop,
    ...overrides,
});

const mockSkills = [
    {
        id: "skill-1",
        name: "React",
        category_name: "Frontend",
        category_parent_name: "Development",
        category: { id: "cat-1", name: "Frontend" },
    },
    {
        id: "skill-2",
        name: "Node.js",
        category_name: "Backend",
        category_parent_name: "Development",
        category: { id: "cat-2", name: "Backend" },
    },
];

describe("AdminSkillTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useSkillTable as jest.Mock).mockReturnValue({
            state: makeState(),
            paginatedSkills: mockSkills,
            sortDir: "asc",
            handleSortToggle: noop,
        });
    });

    it("renders skill names and categories", () => {
        render(<AdminSkillTable />);

        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("Node.js")).toBeInTheDocument();
        expect(screen.getAllByText("Development")).toHaveLength(2);
        expect(screen.getByText("Frontend")).toBeInTheDocument();
        expect(screen.getByText("Backend")).toBeInTheDocument();
    });

    it("renders dash for missing category", () => {
        (useSkillTable as jest.Mock).mockReturnValue({
            state: makeState(),
            paginatedSkills: [
                {
                    id: "skill-3",
                    name: "Git",
                    category_name: null,
                    category_parent_name: null,
                    category: null,
                },
            ],
            sortDir: "asc",
            handleSortToggle: noop,
        });

        render(<AdminSkillTable />);

        const dashes = screen.getAllByText("—");
        expect(dashes).toHaveLength(2);
    });

    it("renders create skill button", () => {
        render(<AdminSkillTable />);

        expect(screen.getByText("create_skill")).toBeInTheDocument();
    });

    it("opens create modal when create button is clicked", async () => {
        const user = userEvent.setup();
        render(<AdminSkillTable />);

        await user.click(screen.getByText("create_skill"));

        expect(screen.getByTestId("create-modal")).toBeInTheDocument();
    });

    it("opens edit modal with skill data when edit is triggered", async () => {
        const user = userEvent.setup();
        render(<AdminSkillTable />);

        await user.click(screen.getAllByRole("button", { name: "skill_actions" })[0]);
        await user.click(screen.getByText("edit"));

        const editModal = screen.getByTestId("edit-modal");
        expect(editModal).toBeInTheDocument();
        expect(editModal.textContent).toContain("skill-1");
    });

    it("opens delete modal when delete is triggered", async () => {
        const user = userEvent.setup();
        render(<AdminSkillTable />);

        await user.click(screen.getAllByRole("button", { name: "skill_actions" })[0]);
        await user.click(screen.getByText("delete"));

        expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    });

    it("renders empty state when no skills exist", () => {
        (useSkillTable as jest.Mock).mockReturnValue({
            state: makeState({ isEmpty: true }),
            paginatedSkills: [],
            sortDir: "asc",
            handleSortToggle: noop,
        });

        render(<AdminSkillTable />);

        expect(screen.getByText("no_skills")).toBeInTheDocument();
    });

    it("renders loading skeleton", () => {
        (useSkillTable as jest.Mock).mockReturnValue({
            state: makeState({ isLoading: true }),
            paginatedSkills: [],
            sortDir: "asc",
            handleSortToggle: noop,
        });

        render(<AdminSkillTable />);

        expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });
});
