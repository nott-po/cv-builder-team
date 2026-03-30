import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CreateCVProjectModal } from "@/components/features/cvs/CreateCVProjectModal";
import type { CvProject } from "@/lib/hooks/useCV";
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
    useQuery: () => ({
        data: {
            projects: [
                {
                    id: "proj-1",
                    name: "Project Alpha",
                    domain: "Web",
                    start_date: "2024-01-01",
                    end_date: null,
                    environment: ["React"],
                },
                {
                    id: "proj-2",
                    name: "Project Beta",
                    domain: "Mobile",
                    start_date: "2024-02-01",
                    end_date: null,
                    environment: ["Flutter"],
                },
            ],
        },
    }),
}));

jest.mock("@/lib/hooks/useModalMutation", () => ({
    useModalMutation: jest.fn(),
}));

let capturedAvailableProjects: { id: string; name: string }[] = [];

jest.mock("@/components/features/cvs/CVProjectForm", () => ({
    CVProjectForm: ({
        mode,
        availableProjects,
        onCancel,
        onSubmit,
    }: {
        mode: string;
        availableProjects: { id: string; name: string }[];
        onCancel: () => void;
        onSubmit: (data: Record<string, string>) => void;
    }) => {
        capturedAvailableProjects = availableProjects;
        return (
            <div data-testid="cv-project-form">
                <span data-testid="mode">{mode}</span>
                <span data-testid="project-count">{availableProjects.length}</span>
                <button onClick={onCancel}>Cancel</button>
                <button
                    onClick={() =>
                        onSubmit({
                            projectId: "proj-1",
                            start_date: "2024-01-01",
                            end_date: "",
                            roles: "Dev, QA",
                            responsibilities: "Code\nReview",
                        })
                    }
                >
                    Submit
                </button>
            </div>
        );
    },
}));

const existingProject: CvProject = {
    id: "cv-proj-1",
    name: "Project Alpha",
    start_date: "2024-01-01",
    end_date: null,
    description: "Existing project",
    domain: "Web",
    responsibilities: ["Code"],
    roles: ["Dev"],
    environment: ["React"],
    project: { id: "proj-1" },
};

describe("CreateCVProjectModal", () => {
    const mockHandleMutate = jest.fn();
    const mockHandleOpenChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        capturedAvailableProjects = [];
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: null,
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });
    });

    it("renders dialog title when open", () => {
        render(
            <CreateCVProjectModal
                open={true}
                cvId="cv-1"
                existingProjects={[]}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByText("add_project")).toBeInTheDocument();
    });

    it("does not render content when closed", () => {
        render(
            <CreateCVProjectModal
                open={false}
                cvId="cv-1"
                existingProjects={[]}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.queryByText("add_project")).not.toBeInTheDocument();
    });

    it("renders CVProjectForm in add mode", () => {
        render(
            <CreateCVProjectModal
                open={true}
                cvId="cv-1"
                existingProjects={[]}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByTestId("mode")).toHaveTextContent("add");
    });

    it("filters out already added projects from available options", () => {
        render(
            <CreateCVProjectModal
                open={true}
                cvId="cv-1"
                existingProjects={[existingProject]}
                onOpenChange={jest.fn()}
            />,
        );

        const projectNames = capturedAvailableProjects.map((p) => p.name);
        expect(projectNames).not.toContain("Project Alpha");
        expect(projectNames).toContain("Project Beta");
    });

    it("shows all projects when none are already added", () => {
        render(
            <CreateCVProjectModal
                open={true}
                cvId="cv-1"
                existingProjects={[]}
                onOpenChange={jest.fn()}
            />,
        );

        expect(capturedAvailableProjects).toHaveLength(2);
    });

    it("calls handleOpenChange(false) on cancel", async () => {
        const user = userEvent.setup();
        render(
            <CreateCVProjectModal
                open={true}
                cvId="cv-1"
                existingProjects={[]}
                onOpenChange={jest.fn()}
            />,
        );

        await user.click(screen.getByText("Cancel"));

        expect(mockHandleOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls handleMutate on form submit", async () => {
        const user = userEvent.setup();
        render(
            <CreateCVProjectModal
                open={true}
                cvId="cv-1"
                existingProjects={[]}
                onOpenChange={jest.fn()}
            />,
        );

        await user.click(screen.getByText("Submit"));

        expect(mockHandleMutate).toHaveBeenCalledWith(
            {
                projectId: "proj-1",
                start_date: "2024-01-01",
                end_date: "",
                roles: "Dev, QA",
                responsibilities: "Code\nReview",
            },
            "add_project_error",
        );
    });
});
