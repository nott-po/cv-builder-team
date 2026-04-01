import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EditProjectModal } from "@/components/features/projects/admin/EditProjectModal";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

jest.mock("next-intl");

jest.mock("@/i18n/routing", () => ({
    useRouter: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useSearchParams: jest.fn(() => ({ get: jest.fn(), toString: () => "" })),
}));

jest.mock("@tanstack/react-query", () => ({
    useQueryClient: jest.fn(() => ({
        invalidateQueries: jest.fn(),
    })),
    useQuery: jest.fn(() => ({ data: { skills: [] } })),
}));

jest.mock("@/lib/hooks/useModalMutation", () => ({
    useModalMutation: jest.fn(),
}));

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

const mockProject = {
    id: "proj-1",
    name: "CV Builder",
    domain: "HR Tech",
    start_date: "2024-01-15",
    end_date: "2024-06-30",
    description: "Employee CV management",
    environment: ["React", "Node.js"],
};

describe("EditProjectModal", () => {
    const mockHandleMutate = jest.fn();
    const mockHandleOpenChange = jest.fn();
    const mockOnOpenChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: null,
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });
    });

    it("renders nothing when closed", () => {
        const { container } = render(
            <EditProjectModal open={false} project={mockProject} onOpenChange={mockOnOpenChange} />,
        );

        expect(container.querySelector("[role='dialog']")).not.toBeInTheDocument();
    });

    it("renders dialog with edit title when open", () => {
        render(
            <EditProjectModal open={true} project={mockProject} onOpenChange={mockOnOpenChange} />,
        );

        expect(screen.getByText("edit_project_title")).toBeInTheDocument();
    });

    it("renders update submit button", () => {
        render(
            <EditProjectModal open={true} project={mockProject} onOpenChange={mockOnOpenChange} />,
        );

        expect(screen.getByRole("button", { name: "update" })).toBeInTheDocument();
    });

    it("pre-fills form with project data", () => {
        render(
            <EditProjectModal open={true} project={mockProject} onOpenChange={mockOnOpenChange} />,
        );

        expect(screen.getByPlaceholderText("name")).toHaveValue("CV Builder");
        expect(screen.getByPlaceholderText("domain")).toHaveValue("HR Tech");
    });

    it("does not render form when project is null", () => {
        render(<EditProjectModal open={true} project={null} onOpenChange={mockOnOpenChange} />);

        expect(screen.queryByPlaceholderText("name")).not.toBeInTheDocument();
    });

    it("calls handleOpenChange on cancel", async () => {
        const user = userEvent.setup();
        render(
            <EditProjectModal open={true} project={mockProject} onOpenChange={mockOnOpenChange} />,
        );

        await user.click(screen.getByRole("button", { name: "cancel" }));

        expect(mockHandleOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls handleMutate with updated form data on submit", async () => {
        const user = userEvent.setup();
        render(
            <EditProjectModal open={true} project={mockProject} onOpenChange={mockOnOpenChange} />,
        );

        const nameInput = screen.getByPlaceholderText("name");
        await user.clear(nameInput);
        await user.type(nameInput, "Updated Project");
        await user.click(screen.getByRole("button", { name: "update" }));

        await waitFor(() => {
            expect(mockHandleMutate).toHaveBeenCalledWith(
                expect.objectContaining({ name: "Updated Project", domain: "HR Tech" }),
                expect.any(String),
            );
        });
    });

    it("displays error when submitError is set", () => {
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: "Update failed",
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });

        render(
            <EditProjectModal open={true} project={mockProject} onOpenChange={mockOnOpenChange} />,
        );

        expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
});
