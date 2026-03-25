import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProfileLanguageTable } from "@/components/features/languages/profile/ProfileLanguageTable";
import { useProfileLanguages } from "@/lib/hooks/useProfileLanguages";

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
            languages: [{ name: "English" }, { name: "Polish" }, { name: "German" }],
        },
        isLoading: false,
    })),
    useQueryClient: jest.fn(() => ({
        invalidateQueries: jest.fn(),
    })),
}));

jest.mock("@/lib/hooks/useProfileLanguages", () => ({
    useProfileLanguages: jest.fn(),
    profileLanguagesKey: (id: string) => ["profile", id, "languages"],
}));

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

jest.mock("@/components/features/languages/profile/ProfileLanguageTableSkeleton", () => ({
    ProfileLanguageTableSkeleton: () => <div data-testid="skeleton" />,
}));

jest.mock("@/components/shared/ErrorMessage", () => ({
    ErrorMessage: ({ message }: { message: string }) => <div data-testid="error">{message}</div>,
}));

jest.mock("@/components/features/languages/profile/AddProfileLanguageModal", () => ({
    AddProfileLanguageModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="add-modal">Add</div> : null,
}));

jest.mock("@/components/shared/RemoveProfileItemModal", () => ({
    RemoveProfileItemModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="remove-modal">Remove</div> : null,
}));

const mockLanguages = [
    { name: "English", proficiency: "Native" },
    { name: "Polish", proficiency: "Advanced" },
];

describe("ProfileLanguageTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useProfileLanguages as jest.Mock).mockReturnValue({
            languages: mockLanguages,
            isLoading: false,
            isError: false,
        });
    });

    it("renders language names and proficiencies", () => {
        render(<ProfileLanguageTable userId="user-1" />);

        expect(screen.getByText("English")).toBeInTheDocument();
        expect(screen.getByText("Polish")).toBeInTheDocument();
        expect(screen.getByText("Native")).toBeInTheDocument();
        expect(screen.getByText("Advanced")).toBeInTheDocument();
    });

    it("renders loading skeleton when loading", () => {
        (useProfileLanguages as jest.Mock).mockReturnValue({
            languages: [],
            isLoading: true,
            isError: false,
        });

        render(<ProfileLanguageTable userId="user-1" />);

        expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });

    it("renders error message on error", () => {
        (useProfileLanguages as jest.Mock).mockReturnValue({
            languages: [],
            isLoading: false,
            isError: true,
        });

        render(<ProfileLanguageTable userId="user-1" />);

        expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    it("renders empty state when no languages", () => {
        (useProfileLanguages as jest.Mock).mockReturnValue({
            languages: [],
            isLoading: false,
            isError: false,
        });

        render(<ProfileLanguageTable userId="user-1" />);

        expect(screen.getByText("no_languages")).toBeInTheDocument();
    });

    it("renders add language button when not read-only", () => {
        render(<ProfileLanguageTable userId="user-1" />);

        expect(screen.getByText("add_language")).toBeInTheDocument();
    });

    it("does not render add button in read-only mode", () => {
        render(<ProfileLanguageTable userId="user-1" readOnly />);

        expect(screen.queryByText("add_language")).not.toBeInTheDocument();
    });

    it("does not render row action dropdowns in read-only mode", () => {
        render(<ProfileLanguageTable userId="user-1" readOnly />);

        expect(screen.queryByRole("button", { name: "language_actions" })).not.toBeInTheDocument();
    });

    it("renders row action dropdowns when not read-only", () => {
        render(<ProfileLanguageTable userId="user-1" />);

        const actionButtons = screen.getAllByRole("button", { name: "language_actions" });
        expect(actionButtons).toHaveLength(2);
    });

    it("opens add modal when add button is clicked", async () => {
        const user = userEvent.setup();
        render(<ProfileLanguageTable userId="user-1" />);

        await user.click(screen.getByText("add_language"));

        expect(screen.getByTestId("add-modal")).toBeInTheDocument();
    });

    it("opens remove modal when delete action is triggered", async () => {
        const user = userEvent.setup();
        render(<ProfileLanguageTable userId="user-1" />);

        await user.click(screen.getAllByRole("button", { name: "language_actions" })[0]);
        await user.click(screen.getByText("delete"));

        expect(screen.getByTestId("remove-modal")).toBeInTheDocument();
    });

    it("opens add modal in edit mode when edit action is triggered", async () => {
        const user = userEvent.setup();
        render(<ProfileLanguageTable userId="user-1" />);

        await user.click(screen.getAllByRole("button", { name: "language_actions" })[0]);
        await user.click(screen.getByText("edit"));

        expect(screen.getByTestId("add-modal")).toBeInTheDocument();
    });

    it("passes userId to useProfileLanguages", () => {
        render(<ProfileLanguageTable userId="user-42" />);

        expect(useProfileLanguages).toHaveBeenCalledWith("user-42");
    });
});
