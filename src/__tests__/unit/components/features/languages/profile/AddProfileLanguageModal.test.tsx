import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AddProfileLanguageModal } from "@/components/features/languages/profile/AddProfileLanguageModal";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

jest.mock("next-intl");

jest.mock("@/i18n/routing", () => ({
    useRouter: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useSearchParams: jest.fn(() => ({ get: jest.fn(), toString: () => "" })),
}));

jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(() => ({
        data: {
            languages: [
                { id: "1", name: "English", iso2: "EN", native_name: "English" },
                { id: "2", name: "Polish", iso2: "PL", native_name: "Polski" },
                { id: "3", name: "German", iso2: "DE", native_name: "Deutsch" },
            ],
        },
    })),
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

jest.mock("@/generated/graphql", () => ({
    Proficiency: {
        A1: "A1",
        A2: "A2",
        B1: "B1",
        B2: "B2",
        C1: "C1",
        C2: "C2",
        Native: "Native",
    },
}));

const mockHandleMutate = jest.fn();
const mockHandleOpenChange = jest.fn();

describe("AddProfileLanguageModal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: null,
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });
    });

    it("renders add language title when no editing language", () => {
        render(
            <AddProfileLanguageModal
                open={true}
                userId="user-1"
                existingLanguages={[]}
                editingLanguage={null}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByText("add_language_title")).toBeInTheDocument();
    });

    it("renders edit language title when editing language is provided", () => {
        render(
            <AddProfileLanguageModal
                open={true}
                userId="user-1"
                existingLanguages={[]}
                editingLanguage={{ name: "English", proficiency: "Native" as const }}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByText("edit_language_title")).toBeInTheDocument();
    });

    it("renders nothing when closed", () => {
        const { container } = render(
            <AddProfileLanguageModal
                open={false}
                userId="user-1"
                existingLanguages={[]}
                editingLanguage={null}
                onOpenChange={jest.fn()}
            />,
        );

        expect(container.querySelector("[role='dialog']")).not.toBeInTheDocument();
    });

    it("shows create label for new language", () => {
        render(
            <AddProfileLanguageModal
                open={true}
                userId="user-1"
                existingLanguages={[]}
                editingLanguage={null}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByRole("button", { name: "create" })).toBeInTheDocument();
    });

    it("shows save label when editing", () => {
        render(
            <AddProfileLanguageModal
                open={true}
                userId="user-1"
                existingLanguages={[]}
                editingLanguage={{ name: "English", proficiency: "Native" as const }}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByRole("button", { name: "save" })).toBeInTheDocument();
    });

    it("calls handleOpenChange(false) on cancel", async () => {
        const user = userEvent.setup();
        render(
            <AddProfileLanguageModal
                open={true}
                userId="user-1"
                existingLanguages={[]}
                editingLanguage={null}
                onOpenChange={jest.fn()}
            />,
        );

        await user.click(screen.getByRole("button", { name: "cancel" }));

        expect(mockHandleOpenChange).toHaveBeenCalledWith(false);
    });

    it("displays error when submitError is set", () => {
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: "Failed to add language",
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });

        render(
            <AddProfileLanguageModal
                open={true}
                userId="user-1"
                existingLanguages={[]}
                editingLanguage={null}
                onOpenChange={jest.fn()}
            />,
        );

        expect(screen.getByText("Failed to add language")).toBeInTheDocument();
    });
});
