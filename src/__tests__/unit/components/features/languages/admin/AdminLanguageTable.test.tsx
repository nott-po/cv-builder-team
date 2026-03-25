import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AdminLanguageTable } from "@/components/features/languages/admin/AdminLanguageTable";
import { useLanguageTable } from "@/lib/hooks/useLanguageTable";
import type { TableState } from "@/types/table";

jest.mock("next-intl");

jest.mock("@tanstack/react-query", () => ({
    useQueryClient: jest.fn(() => ({
        invalidateQueries: jest.fn(),
    })),
}));

jest.mock("@/lib/hooks/useLanguageTable", () => ({
    useLanguageTable: jest.fn(),
    languagesListKey: () => ["languages", "list"],
}));

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

jest.mock("@/components/features/languages/admin/LanguageTableSkeleton", () => ({
    LanguageTableSkeleton: () => <div data-testid="skeleton" />,
}));

jest.mock("@/components/shared/ErrorMessage", () => ({
    ErrorMessage: () => <div data-testid="error" />,
}));

jest.mock("@/components/features/languages/admin/CreateLanguageModal", () => ({
    CreateLanguageModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="create-modal">Create</div> : null,
}));

jest.mock("@/components/features/languages/admin/EditLanguageModal", () => ({
    EditLanguageModal: ({ open, language }: { open: boolean; language: unknown }) =>
        open ? <div data-testid="edit-modal">{JSON.stringify(language)}</div> : null,
}));

jest.mock("@/components/shared/AdminDeleteModal", () => ({
    AdminDeleteModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="delete-modal">Delete</div> : null,
}));

const noop = jest.fn();

const makeState = (overrides: Partial<TableState> = {}): TableState => ({
    isLoading: false,
    isError: false,
    isEmpty: false,
    search: "",
    onSearchChange: noop,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    onPageChange: noop,
    onPageSizeChange: noop,
    ...overrides,
});

const mockLanguages = [
    { id: "lang-1", iso2: "EN", name: "English", native_name: null },
    { id: "lang-2", iso2: "PL", name: "Polish", native_name: "Polski" },
];

describe("AdminLanguageTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useLanguageTable as jest.Mock).mockReturnValue({
            state: makeState(),
            paginatedLanguages: mockLanguages,
        });
    });

    it("renders language names, ISO2 codes and native names", () => {
        render(<AdminLanguageTable />);

        expect(screen.getByText("English")).toBeInTheDocument();
        expect(screen.getByText("Polish")).toBeInTheDocument();
        expect(screen.getByText("EN")).toBeInTheDocument();
        expect(screen.getByText("PL")).toBeInTheDocument();
        expect(screen.getByText("Polski")).toBeInTheDocument();
        // English has null native_name, so dash should appear
        expect(screen.getByText("—")).toBeInTheDocument();
    });

    it("renders create language button", () => {
        render(<AdminLanguageTable />);

        expect(screen.getByText("create_language")).toBeInTheDocument();
    });

    it("opens create modal when create button is clicked", async () => {
        const user = userEvent.setup();
        render(<AdminLanguageTable />);

        await user.click(screen.getByText("create_language"));

        expect(screen.getByTestId("create-modal")).toBeInTheDocument();
    });

    it("renders row action buttons for each language", () => {
        render(<AdminLanguageTable />);

        const actionButtons = screen.getAllByRole("button", { name: "language_actions" });
        expect(actionButtons).toHaveLength(2);
    });

    it("opens edit modal when edit action is triggered", async () => {
        const user = userEvent.setup();
        render(<AdminLanguageTable />);

        await user.click(screen.getAllByRole("button", { name: "language_actions" })[0]);
        await user.click(screen.getByText("edit"));

        const editModal = screen.getByTestId("edit-modal");
        expect(editModal).toBeInTheDocument();
        expect(editModal.textContent).toContain("lang-1");
    });

    it("opens delete modal when delete action is triggered", async () => {
        const user = userEvent.setup();
        render(<AdminLanguageTable />);

        await user.click(screen.getAllByRole("button", { name: "language_actions" })[0]);
        await user.click(screen.getByText("delete"));

        expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    });

    it("renders empty state when no languages exist", () => {
        (useLanguageTable as jest.Mock).mockReturnValue({
            state: makeState({ isEmpty: true }),
            paginatedLanguages: [],
        });

        render(<AdminLanguageTable />);

        expect(screen.getByText("no_languages")).toBeInTheDocument();
    });

    it("renders loading skeleton when loading", () => {
        (useLanguageTable as jest.Mock).mockReturnValue({
            state: makeState({ isLoading: true }),
            paginatedLanguages: [],
        });

        render(<AdminLanguageTable />);

        expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });
});
