import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CVProjectTable } from "@/components/features/cvs/CVProjectTable";

jest.mock("next-intl");

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

const mockProjects = [
    {
        id: "cp-1",
        name: "Alpha Project",
        start_date: "2024-01-01",
        end_date: "2024-06-30",
        description: "Web application",
        domain: "Web",
        responsibilities: ["Coding", "Review"],
        roles: ["Developer"],
        environment: ["React", "TypeScript"],
        project: { id: "proj-1" },
    },
    {
        id: "cp-2",
        name: "Beta Project",
        start_date: "2024-03-01",
        end_date: null,
        description: "Mobile app",
        domain: "Mobile",
        responsibilities: ["Architecture"],
        roles: ["Lead"],
        environment: ["Flutter"],
        project: { id: "proj-2" },
    },
];

let useCvReturn = {
    cv: {
        id: "cv-1",
        created_at: "2024-01-01",
        name: "Test CV",
        education: "MIT",
        description: "Test",
        projects: mockProjects,
        skills: [],
        languages: [],
    } as
        | {
              id: string;
              projects: typeof mockProjects;
              [key: string]: unknown;
          }
        | undefined,
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
};

jest.mock("@/lib/hooks/useCV", () => ({
    useCv: () => useCvReturn,
    cvDetailKey: (id: string) => ["cv", "detail", id],
}));

jest.mock("@tanstack/react-query", () => ({
    useQuery: () => ({ data: { projects: [] } }),
    useQueryClient: () => ({ invalidateQueries: jest.fn() }),
    useMutation: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

jest.mock("@/components/features/cvs/CreateCVProjectModal", () => ({
    CreateCVProjectModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="create-project-modal">Create Project Modal</div> : null,
}));

jest.mock("@/components/features/cvs/EditCVProjectModal", () => ({
    EditCVProjectModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="edit-project-modal">Edit Project Modal</div> : null,
}));

jest.mock("@/components/shared/RemoveProfileItemModal", () => ({
    RemoveProfileItemModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="remove-project-modal">Remove</div> : null,
}));

jest.mock("@/components/shared/RowActionsDropdown", () => ({
    RowActionsDropdown: ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
        <div data-testid="row-actions">
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>
        </div>
    ),
}));

jest.mock("@/components/shared/SortableColumnHeader", () => ({
    SortableColumnHeader: ({ label, onToggle }: { label: string; onToggle: () => void }) => (
        <th onClick={onToggle}>{label}</th>
    ),
}));

jest.mock("@/components/features/projects/admin/ProjectTableSkeleton", () => ({
    ProjectTableSkeleton: () => <div data-testid="skeleton" />,
}));

jest.mock("@/components/shared/DataTable", () => ({
    DataTable: ({
        children,
        head,
        actions,
        state,
    }: {
        children: React.ReactNode;
        head: React.ReactNode;
        actions: React.ReactNode;
        state: { isLoading: boolean; isEmpty: boolean };
        messages: { empty: string };
    }) => (
        <div data-testid="data-table">
            <div data-testid="actions">{actions}</div>
            {state.isEmpty ? (
                <p>no_projects</p>
            ) : !state.isLoading ? (
                <table>
                    <thead>
                        <tr>{head}</tr>
                    </thead>
                    <tbody>{children}</tbody>
                </table>
            ) : null}
        </div>
    ),
}));

describe("CVProjectTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useCvReturn = {
            cv: {
                id: "cv-1",
                created_at: "2024-01-01",
                name: "Test CV",
                education: "MIT",
                description: "Test",
                projects: mockProjects,
                skills: [],
                languages: [],
            },
            isLoading: false,
            isError: false,
            refetch: jest.fn(),
        };
    });

    it("renders project names", () => {
        render(<CVProjectTable cvId="cv-1" />);

        expect(screen.getByText("Alpha Project")).toBeInTheDocument();
        expect(screen.getByText("Beta Project")).toBeInTheDocument();
    });

    it("renders project roles", () => {
        render(<CVProjectTable cvId="cv-1" />);

        expect(screen.getByText("Developer")).toBeInTheDocument();
        expect(screen.getByText("Lead")).toBeInTheDocument();
    });

    it("renders project descriptions", () => {
        render(<CVProjectTable cvId="cv-1" />);

        expect(screen.getByText("Web application")).toBeInTheDocument();
        expect(screen.getByText("Mobile app")).toBeInTheDocument();
    });

    it("renders environment badges", () => {
        render(<CVProjectTable cvId="cv-1" />);

        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("TypeScript")).toBeInTheDocument();
        expect(screen.getByText("Flutter")).toBeInTheDocument();
    });

    it("shows add project button when not read-only", () => {
        render(<CVProjectTable cvId="cv-1" />);

        expect(screen.getByText("add_project")).toBeInTheDocument();
    });

    it("hides add project button in read-only mode", () => {
        render(<CVProjectTable cvId="cv-1" readOnly={true} />);

        expect(screen.queryByText("add_project")).not.toBeInTheDocument();
    });

    it("shows row actions when not read-only", () => {
        render(<CVProjectTable cvId="cv-1" />);

        expect(screen.getAllByTestId("row-actions").length).toBeGreaterThan(0);
    });

    it("hides row actions in read-only mode", () => {
        render(<CVProjectTable cvId="cv-1" readOnly={true} />);

        expect(screen.queryAllByTestId("row-actions")).toHaveLength(0);
    });

    it("shows empty state when no projects", () => {
        useCvReturn = {
            cv: {
                id: "cv-1",
                created_at: "2024-01-01",
                name: "Test CV",
                education: "MIT",
                description: "Test",
                projects: [],
                skills: [],
                languages: [],
            },
            isLoading: false,
            isError: false,
            refetch: jest.fn(),
        };

        render(<CVProjectTable cvId="cv-1" />);

        expect(screen.getByText("no_projects")).toBeInTheDocument();
    });

    it("opens create project modal on add button click", async () => {
        const user = userEvent.setup();
        render(<CVProjectTable cvId="cv-1" />);

        await user.click(screen.getByText("add_project"));

        expect(screen.getByTestId("create-project-modal")).toBeInTheDocument();
    });
});
