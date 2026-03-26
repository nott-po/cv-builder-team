import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AdminPositionTable } from "@/components/features/positions/AdminPositionTable";
import { usePositionTable } from "@/lib/hooks/usePositionTable";
import type { TableState } from "@/types/table";

jest.mock("next-intl");

jest.mock("@tanstack/react-query", () => ({
    useQueryClient: jest.fn(() => ({
        invalidateQueries: jest.fn(),
    })),
}));

jest.mock("@/lib/hooks/usePositionTable", () => ({
    usePositionTable: jest.fn(),
    positionsListKey: () => ["positions", "list"],
}));

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

jest.mock("@/components/shared/NameOnlyTableSkeleton", () => ({
    NameOnlyTableSkeleton: () => <div data-testid="skeleton" />,
}));

jest.mock("@/components/shared/ErrorMessage", () => ({
    ErrorMessage: () => <div data-testid="error" />,
}));

jest.mock("@/components/shared/AdminNameModal", () => ({
    AdminNameModal: ({ open, title }: { open: boolean; title: string }) =>
        open ? <div data-testid="name-modal">{title}</div> : null,
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

const mockPositions = [
    { id: "pos-1", name: "Developer" },
    { id: "pos-2", name: "Manager" },
];

describe("AdminPositionTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (usePositionTable as jest.Mock).mockReturnValue({
            state: makeState(),
            paginatedPositions: mockPositions,
        });
    });

    it("renders position names in the table", () => {
        render(<AdminPositionTable />);

        expect(screen.getByText("Developer")).toBeInTheDocument();
        expect(screen.getByText("Manager")).toBeInTheDocument();
    });

    it("opens create modal when create button is clicked", async () => {
        const user = userEvent.setup();
        render(<AdminPositionTable />);

        await user.click(screen.getByText("create_position"));

        expect(screen.getByTestId("name-modal")).toHaveTextContent("create_position_title");
    });

    it("renders row action buttons for each position", () => {
        render(<AdminPositionTable />);

        const actionButtons = screen.getAllByRole("button", { name: "position_actions" });
        expect(actionButtons).toHaveLength(2);
    });

    it("opens edit modal when edit action is triggered", async () => {
        const user = userEvent.setup();
        render(<AdminPositionTable />);

        await user.click(screen.getAllByRole("button", { name: "position_actions" })[0]);
        await user.click(screen.getByText("edit"));

        expect(screen.getByTestId("name-modal")).toHaveTextContent("edit_position_title");
    });

    it("opens delete modal when delete action is triggered", async () => {
        const user = userEvent.setup();
        render(<AdminPositionTable />);

        await user.click(screen.getAllByRole("button", { name: "position_actions" })[0]);
        await user.click(screen.getByText("delete"));

        expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    });

    it("renders empty state when no positions exist", () => {
        (usePositionTable as jest.Mock).mockReturnValue({
            state: makeState({ isEmpty: true }),
            paginatedPositions: [],
        });

        render(<AdminPositionTable />);

        expect(screen.getByText("no_positions")).toBeInTheDocument();
    });

    it("renders loading skeleton when loading", () => {
        (usePositionTable as jest.Mock).mockReturnValue({
            state: makeState({ isLoading: true }),
            paginatedPositions: [],
        });

        render(<AdminPositionTable />);

        expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });

    it("renders error message when data fails to load", () => {
        (usePositionTable as jest.Mock).mockReturnValue({
            state: makeState({ isError: true }),
            paginatedPositions: [],
        });

        render(<AdminPositionTable />);

        expect(screen.getByTestId("error")).toBeInTheDocument();
    });
});
