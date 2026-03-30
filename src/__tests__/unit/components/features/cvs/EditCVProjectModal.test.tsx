import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EditCVProjectModal } from "@/components/features/cvs/EditCVProjectModal";
import type { CvProject } from "@/lib/hooks/useCV";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

jest.mock("next-intl");

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

jest.mock("@tanstack/react-query", () => ({
    useQueryClient: () => ({ invalidateQueries: jest.fn() }),
}));

jest.mock("@/lib/hooks/useModalMutation", () => ({
    useModalMutation: jest.fn(),
}));

let capturedDefaults: Record<string, string> | null = null;

jest.mock("@/components/features/cvs/CVProjectForm", () => ({
    CVProjectForm: ({
        mode,
        defaultValues,
        onCancel,
        onSubmit,
    }: {
        mode: string;
        defaultValues: Record<string, string>;
        onCancel: () => void;
        onSubmit: (data: Record<string, string>) => void;
    }) => {
        capturedDefaults = defaultValues;
        return (
            <div data-testid="cv-project-form">
                <span data-testid="mode">{mode}</span>
                <button onClick={onCancel}>Cancel</button>
                <button
                    onClick={() =>
                        onSubmit({
                            projectId: "proj-1",
                            start_date: "2024-06-01",
                            end_date: "2024-12-31",
                            roles: "Lead",
                            responsibilities: "Architecture",
                        })
                    }
                >
                    Submit
                </button>
            </div>
        );
    },
}));

const mockProject: CvProject = {
    id: "cv-proj-1",
    name: "Project Alpha",
    start_date: "2024-01-01",
    end_date: "2024-06-30",
    description: "A web project",
    domain: "Web",
    responsibilities: ["Code review", "Architecture"],
    roles: ["Lead", "Developer"],
    environment: ["React", "Node.js"],
    project: { id: "proj-1" },
};

describe("EditCVProjectModal", () => {
    const mockHandleMutate = jest.fn();
    const mockHandleOpenChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        capturedDefaults = null;
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: null,
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });
    });

    it("renders dialog title when open", () => {
        render(
            <EditCVProjectModal
                open={true}
                cvId="cv-1"
                project={mockProject}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByText("edit_project")).toBeInTheDocument();
    });

    it("does not render content when closed", () => {
        render(
            <EditCVProjectModal
                open={false}
                cvId="cv-1"
                project={mockProject}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.queryByText("edit_project")).not.toBeInTheDocument();
    });

    it("renders CVProjectForm in edit mode", () => {
        render(
            <EditCVProjectModal
                open={true}
                cvId="cv-1"
                project={mockProject}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByTestId("mode")).toHaveTextContent("edit");
    });

    it("passes project data as default values with joined arrays", () => {
        render(
            <EditCVProjectModal
                open={true}
                cvId="cv-1"
                project={mockProject}
                onOpenChange={jest.fn()}
            />,
        );

        expect(capturedDefaults).toEqual({
            projectId: "proj-1",
            start_date: "2024-01-01",
            end_date: "2024-06-30",
            roles: "Lead, Developer",
            responsibilities: "Code review\nArchitecture",
        });
    });

    it("handles null end_date gracefully", () => {
        const projectNoEnd = { ...mockProject, end_date: null };
        render(
            <EditCVProjectModal
                open={true}
                cvId="cv-1"
                project={projectNoEnd}
                onOpenChange={jest.fn()}
            />,
        );

        expect(capturedDefaults?.end_date).toBe("");
    });

    it("calls handleOpenChange(false) on cancel", async () => {
        const user = userEvent.setup();
        render(
            <EditCVProjectModal
                open={true}
                cvId="cv-1"
                project={mockProject}
                onOpenChange={jest.fn()}
            />,
        );

        await user.click(screen.getByText("Cancel"));

        expect(mockHandleOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls handleMutate on form submit", async () => {
        const user = userEvent.setup();
        render(
            <EditCVProjectModal
                open={true}
                cvId="cv-1"
                project={mockProject}
                onOpenChange={jest.fn()}
            />,
        );

        await user.click(screen.getByText("Submit"));

        expect(mockHandleMutate).toHaveBeenCalledWith(
            expect.objectContaining({
                projectId: "proj-1",
                start_date: "2024-06-01",
            }),
            "edit_project_error",
        );
    });
});
