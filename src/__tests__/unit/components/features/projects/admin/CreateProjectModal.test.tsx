import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CreateProjectModal } from "@/components/features/projects/admin/CreateProjectModal";
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

describe("CreateProjectModal", () => {
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
            <CreateProjectModal open={false} onOpenChange={mockOnOpenChange} />,
        );

        expect(container.querySelector("[role='dialog']")).not.toBeInTheDocument();
    });

    it("renders dialog with create title when open", () => {
        render(<CreateProjectModal open={true} onOpenChange={mockOnOpenChange} />);

        expect(screen.getByText("create_project_title")).toBeInTheDocument();
    });

    it("renders create submit button", () => {
        render(<CreateProjectModal open={true} onOpenChange={mockOnOpenChange} />);

        expect(screen.getByRole("button", { name: "create" })).toBeInTheDocument();
    });

    it("renders name and domain fields", () => {
        render(<CreateProjectModal open={true} onOpenChange={mockOnOpenChange} />);

        expect(screen.getByPlaceholderText("name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("domain")).toBeInTheDocument();
    });

    it("calls handleOpenChange on cancel", async () => {
        const user = userEvent.setup();
        render(<CreateProjectModal open={true} onOpenChange={mockOnOpenChange} />);

        await user.click(screen.getByRole("button", { name: "cancel" }));

        expect(mockHandleOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls handleMutate with form data on submit", async () => {
        const user = userEvent.setup();
        render(<CreateProjectModal open={true} onOpenChange={mockOnOpenChange} />);

        await user.type(screen.getByPlaceholderText("name"), "CV Builder");
        await user.type(screen.getByPlaceholderText("domain"), "HR Tech");

        const dateInputs = document.querySelectorAll("input[type='date']");
        fireEvent.change(dateInputs[0], { target: { value: "2024-01-15" } });

        await user.click(screen.getByRole("button", { name: "create" }));

        await waitFor(() => {
            expect(mockHandleMutate).toHaveBeenCalledWith(
                expect.objectContaining({ name: "CV Builder", domain: "HR Tech" }),
                expect.any(String),
            );
        });
    });

    it("displays error when submitError is set", () => {
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: "Project creation failed",
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });

        render(<CreateProjectModal open={true} onOpenChange={mockOnOpenChange} />);

        expect(screen.getByText("Project creation failed")).toBeInTheDocument();
    });
});
