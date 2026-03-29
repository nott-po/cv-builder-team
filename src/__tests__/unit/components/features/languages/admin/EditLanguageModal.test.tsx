import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EditLanguageModal } from "@/components/features/languages/admin/EditLanguageModal";
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

const mockLanguage = {
    id: "lang-1",
    iso2: "PL",
    name: "Polish",
    native_name: "Polski",
};

describe("EditLanguageModal", () => {
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
            <EditLanguageModal
                open={false}
                language={mockLanguage}
                onOpenChange={mockOnOpenChange}
            />,
        );

        expect(container.querySelector("[role='dialog']")).not.toBeInTheDocument();
    });

    it("renders dialog with edit title when open", () => {
        render(
            <EditLanguageModal
                open={true}
                language={mockLanguage}
                onOpenChange={mockOnOpenChange}
            />,
        );

        expect(screen.getByText("edit_language_title")).toBeInTheDocument();
    });

    it("renders save submit button", () => {
        render(
            <EditLanguageModal
                open={true}
                language={mockLanguage}
                onOpenChange={mockOnOpenChange}
            />,
        );

        expect(screen.getByRole("button", { name: "save" })).toBeInTheDocument();
    });

    it("pre-fills form with language data", () => {
        render(
            <EditLanguageModal
                open={true}
                language={mockLanguage}
                onOpenChange={mockOnOpenChange}
            />,
        );

        expect(screen.getByPlaceholderText("iso2")).toHaveValue("PL");
        expect(screen.getByPlaceholderText("name")).toHaveValue("Polish");
        expect(screen.getByPlaceholderText("native_name")).toHaveValue("Polski");
    });

    it("does not render form when language is null", () => {
        render(<EditLanguageModal open={true} language={null} onOpenChange={mockOnOpenChange} />);

        expect(screen.queryByPlaceholderText("iso2")).not.toBeInTheDocument();
    });

    it("calls handleOpenChange on cancel", async () => {
        const user = userEvent.setup();
        render(
            <EditLanguageModal
                open={true}
                language={mockLanguage}
                onOpenChange={mockOnOpenChange}
            />,
        );

        await user.click(screen.getByRole("button", { name: "cancel" }));

        expect(mockHandleOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls handleMutate with updated form data on submit", async () => {
        const user = userEvent.setup();
        render(
            <EditLanguageModal
                open={true}
                language={mockLanguage}
                onOpenChange={mockOnOpenChange}
            />,
        );

        const nameInput = screen.getByPlaceholderText("name");
        await user.clear(nameInput);
        await user.type(nameInput, "Updated Polish");
        await user.click(screen.getByRole("button", { name: "save" }));

        await waitFor(() => {
            expect(mockHandleMutate).toHaveBeenCalledWith(
                { iso2: "PL", name: "Updated Polish", native_name: "Polski" },
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
            <EditLanguageModal
                open={true}
                language={mockLanguage}
                onOpenChange={mockOnOpenChange}
            />,
        );

        expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
});
