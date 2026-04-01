import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CreateCVModal } from "@/components/features/cvs/CreateCVModal";
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
}));

jest.mock("@/lib/hooks/useCurrentUser", () => ({
    useCurrentUser: () => ({ user: { id: "user-1", email: "test@test.com", role: "Employee" } }),
}));

jest.mock("@/lib/hooks/useModalMutation", () => ({
    useModalMutation: jest.fn(),
}));

jest.mock("@/components/features/cvs/CVForm", () => ({
    CvForm: ({
        onSubmit,
        onCancel,
        isSubmitting,
        error,
    }: {
        onSubmit: (data: Record<string, string>) => void;
        onCancel: () => void;
        isSubmitting: boolean;
        error: string | null;
    }) => {
        return (
            <div data-testid="cv-form">
                <span data-testid="is-submitting">{String(isSubmitting)}</span>
                {error && <span data-testid="error">{error}</span>}
                <button onClick={onCancel}>Cancel</button>
                <button
                    onClick={() =>
                        onSubmit({ name: "My CV", education: "MIT", description: "A great CV" })
                    }
                >
                    Submit
                </button>
            </div>
        );
    },
}));

describe("CreateCVModal", () => {
    const mockHandleMutate = jest.fn();
    const mockHandleOpenChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: null,
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });
    });

    it("renders dialog title when open", () => {
        render(<CreateCVModal open={true} onOpenChange={jest.fn()} />);

        expect(screen.getByText("create_cv")).toBeInTheDocument();
    });

    it("renders CvForm inside the dialog", () => {
        render(<CreateCVModal open={true} onOpenChange={jest.fn()} />);

        expect(screen.getByTestId("cv-form")).toBeInTheDocument();
    });

    it("does not render content when closed", () => {
        render(<CreateCVModal open={false} onOpenChange={jest.fn()} />);

        expect(screen.queryByText("create_cv")).not.toBeInTheDocument();
    });

    it("calls handleOpenChange(false) on cancel", async () => {
        const user = userEvent.setup();
        render(<CreateCVModal open={true} onOpenChange={jest.fn()} />);

        await user.click(screen.getByText("Cancel"));

        expect(mockHandleOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls handleMutate with form data and userId on submit", async () => {
        const user = userEvent.setup();
        render(<CreateCVModal open={true} onOpenChange={jest.fn()} />);

        await user.click(screen.getByText("Submit"));

        expect(mockHandleMutate).toHaveBeenCalledWith(
            {
                name: "My CV",
                education: "MIT",
                description: "A great CV",
                userId: "user-1",
            },
            expect.any(Function),
        );
    });

    it("passes isPending to CvForm", () => {
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: true,
            submitError: null,
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });

        render(<CreateCVModal open={true} onOpenChange={jest.fn()} />);

        expect(screen.getByTestId("is-submitting")).toHaveTextContent("true");
    });

    it("passes submitError to CvForm", () => {
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: "Something went wrong",
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });

        render(<CreateCVModal open={true} onOpenChange={jest.fn()} />);

        expect(screen.getByTestId("error")).toHaveTextContent("Something went wrong");
    });
});
