import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AdminProjectTable } from "@/components/features/projects/admin/AdminProjectTable";
import { useProjectTable } from "@/lib/hooks/useProjectTable";
import type { TableState } from "@/types/table";

jest.mock("next-intl");

jest.mock("@/lib/hooks/useProjectTable", () => ({
    useProjectTable: jest.fn(),
    projectsListKey: () => ["projects", "list"],
}));

jest.mock("@/components/features/projects/admin/ProjectTableSkeleton", () => ({
    ProjectTableSkeleton: () => <div data-testid="skeleton" />,
}));

jest.mock("@/components/shared/ErrorMessage", () => ({
    ErrorMessage: () => <div data-testid="error" />,
}));

jest.mock("@/components/features/projects/admin/CreateProjectModal", () => ({
    CreateProjectModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="create-modal">Create</div> : null,
}));

jest.mock("@/components/features/projects/admin/EditProjectModal", () => ({
    EditProjectModal: ({ open, project }: { open: boolean; project: unknown }) =>
        open ? <div data-testid="edit-modal">{JSON.stringify(project)}</div> : null,
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

const mockProjects = [
    {
        id: "proj-1",
        name: "CV Builder",
        domain: "HR Tech",
        start_date: "2024-01-15",
        end_date: "2024-06-30",
        description: "Employee CV management platform",
        environment: ["React", "Node.js"],
    },
    {
        id: "proj-2",
        name: "Dashboard",
        domain: "Analytics",
        start_date: "2024-03-01",
        end_date: null,
        description: "",
        environment: [],
    },
];

describe("AdminProjectTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useProjectTable as jest.Mock).mockReturnValue({
            state: makeState(),
            paginatedProjects: mockProjects,
            sortDir: "asc",
            handleSortToggle: noop,
        });
    });

    it("renders project names and domains", () => {
        render(<AdminProjectTable />);

        expect(screen.getByText("CV Builder")).toBeInTheDocument();
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("HR Tech")).toBeInTheDocument();
        expect(screen.getByText("Analytics")).toBeInTheDocument();
    });

    it("renders project description when present", () => {
        render(<AdminProjectTable />);

        expect(screen.getByText("Employee CV management platform")).toBeInTheDocument();
    });

    it("renders environment tags as badges", () => {
        render(<AdminProjectTable />);

        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("Node.js")).toBeInTheDocument();
    });

    it("opens create modal when create button is clicked", async () => {
        const user = userEvent.setup();
        render(<AdminProjectTable />);

        await user.click(screen.getByText("create_project"));

        expect(screen.getByTestId("create-modal")).toBeInTheDocument();
    });

    it("renders row action buttons for each project", () => {
        render(<AdminProjectTable />);

        const actionButtons = screen.getAllByRole("button", { name: "project_actions" });
        expect(actionButtons).toHaveLength(2);
    });

    it("opens edit modal with project data when edit is triggered", async () => {
        const user = userEvent.setup();
        render(<AdminProjectTable />);

        await user.click(screen.getAllByRole("button", { name: "project_actions" })[0]);
        await user.click(screen.getByText("edit"));

        const editModal = screen.getByTestId("edit-modal");
        expect(editModal).toBeInTheDocument();
        expect(editModal.textContent).toContain("proj-1");
    });

    it("opens delete modal when delete is triggered", async () => {
        const user = userEvent.setup();
        render(<AdminProjectTable />);

        await user.click(screen.getAllByRole("button", { name: "project_actions" })[0]);
        await user.click(screen.getByText("delete"));

        expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    });

    it("renders empty state when no projects exist", () => {
        (useProjectTable as jest.Mock).mockReturnValue({
            state: makeState({ isEmpty: true }),
            paginatedProjects: [],
            sortDir: "asc",
            handleSortToggle: noop,
        });

        render(<AdminProjectTable />);

        expect(screen.getByText("no_projects")).toBeInTheDocument();
    });

    it("renders loading skeleton", () => {
        (useProjectTable as jest.Mock).mockReturnValue({
            state: makeState({ isLoading: true }),
            paginatedProjects: [],
            sortDir: "asc",
            handleSortToggle: noop,
        });

        render(<AdminProjectTable />);

        expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });

    it("renders error message when data fails to load", () => {
        (useProjectTable as jest.Mock).mockReturnValue({
            state: makeState({ isError: true }),
            paginatedProjects: [],
            sortDir: "asc",
            handleSortToggle: noop,
        });

        render(<AdminProjectTable />);

        expect(screen.getByTestId("error")).toBeInTheDocument();
    });
});
