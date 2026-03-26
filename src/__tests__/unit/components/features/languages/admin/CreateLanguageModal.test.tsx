import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CreateLanguageModal } from "@/components/features/languages/admin/CreateLanguageModal";
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
}));

jest.mock("@/lib/hooks/useModalMutation", () => ({
    useModalMutation: jest.fn(),
}));

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

describe("CreateLanguageModal", () => {
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
            <CreateLanguageModal open={false} onOpenChange={mockOnOpenChange} />,
        );

        expect(container.querySelector("[role='dialog']")).not.toBeInTheDocument();
    });

    it("renders dialog with create title when open", () => {
        render(<CreateLanguageModal open={true} onOpenChange={mockOnOpenChange} />);

        expect(screen.getByText("create_language_title")).toBeInTheDocument();
    });

    it("renders create submit button", () => {
        render(<CreateLanguageModal open={true} onOpenChange={mockOnOpenChange} />);

        expect(screen.getByRole("button", { name: "create" })).toBeInTheDocument();
    });

    it("renders ISO2, name and native name fields", () => {
        render(<CreateLanguageModal open={true} onOpenChange={mockOnOpenChange} />);

        expect(screen.getByPlaceholderText("iso2")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("native_name")).toBeInTheDocument();
    });

    it("calls handleOpenChange on cancel", async () => {
        const user = userEvent.setup();
        render(<CreateLanguageModal open={true} onOpenChange={mockOnOpenChange} />);

        await user.click(screen.getByRole("button", { name: "cancel" }));

        expect(mockHandleOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls handleMutate with form data on submit", async () => {
        const user = userEvent.setup();
        render(<CreateLanguageModal open={true} onOpenChange={mockOnOpenChange} />);

        await user.type(screen.getByPlaceholderText("iso2"), "PL");
        await user.type(screen.getByPlaceholderText("name"), "Polish");
        await user.type(screen.getByPlaceholderText("native_name"), "Polski");
        await user.click(screen.getByRole("button", { name: "create" }));

        await waitFor(() => {
            expect(mockHandleMutate).toHaveBeenCalledWith(
                { iso2: "PL", name: "Polish", native_name: "Polski" },
                expect.any(String),
            );
        });
    });

    it("displays error when submitError is set", () => {
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: "Language already exists",
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });

        render(<CreateLanguageModal open={true} onOpenChange={mockOnOpenChange} />);

        expect(screen.getByText("Language already exists")).toBeInTheDocument();
    });
});
