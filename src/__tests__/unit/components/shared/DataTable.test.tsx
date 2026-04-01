import { render, screen } from "@testing-library/react";

import { DataTable } from "@/components/shared/DataTable";
import type { TableState } from "@/types/table";

jest.mock("next-intl");

jest.mock("@/components/shared/SearchInput", () => ({
    SearchInput: ({ placeholder }: { placeholder: string }) => (
        <input data-testid="search" placeholder={placeholder} />
    ),
}));

jest.mock("@/components/shared/Pagination", () => ({
    Pagination: () => <div data-testid="pagination" />,
}));

jest.mock("@/components/shared/ErrorMessage", () => ({
    ErrorMessage: ({ message }: { message: string }) => <div data-testid="error">{message}</div>,
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

const defaultProps = {
    messages: { empty: "No items", error: "Something broke" },
    searchPlaceholder: "Search...",
    skeleton: <div data-testid="skeleton" />,
    head: <th>Name</th>,
    colSpan: 1,
};

describe("DataTable", () => {
    it("renders skeleton when loading", () => {
        render(
            <DataTable state={makeState({ isLoading: true })} {...defaultProps}>
                <tr>
                    <td>Row</td>
                </tr>
            </DataTable>,
        );

        expect(screen.getByTestId("skeleton")).toBeInTheDocument();
        expect(screen.queryByTestId("search")).not.toBeInTheDocument();
    });

    it("renders error message when isError", () => {
        render(
            <DataTable state={makeState({ isError: true })} {...defaultProps}>
                <tr>
                    <td>Row</td>
                </tr>
            </DataTable>,
        );

        expect(screen.getByTestId("error")).toHaveTextContent("Something broke");
    });

    it("renders empty message when isEmpty", () => {
        render(
            <DataTable state={makeState({ isEmpty: true })} {...defaultProps}>
                <tr>
                    <td>Row</td>
                </tr>
            </DataTable>,
        );

        expect(screen.getByText("No items")).toBeInTheDocument();
    });

    it("renders children rows when data is present", () => {
        render(
            <DataTable state={makeState()} {...defaultProps}>
                <tr>
                    <td>John Doe</td>
                </tr>
            </DataTable>,
        );

        expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("renders search input and pagination", () => {
        render(
            <DataTable state={makeState()} {...defaultProps}>
                <tr>
                    <td>Row</td>
                </tr>
            </DataTable>,
        );

        expect(screen.getByTestId("search")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    it("renders actions slot when provided", () => {
        render(
            <DataTable state={makeState()} {...defaultProps} actions={<button>Create</button>}>
                <tr>
                    <td>Row</td>
                </tr>
            </DataTable>,
        );

        expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
    });
});
