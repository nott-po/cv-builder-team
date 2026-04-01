import { renderHook, act } from "@testing-library/react";

import { useSortableTable } from "@/lib/hooks/useSortableTable";
import type { SortDir } from "@/types/table";

const mockPush = jest.fn();
jest.mock("@/i18n/routing", () => ({
    useRouter: () => ({ push: mockPush }),
}));
jest.mock("next/navigation", () => ({
    useSearchParams: () => new URLSearchParams(),
}));

const mockData = {
    items: [
        { id: "1", name: "Banana" },
        { id: "2", name: "Apple" },
        { id: "3", name: "Cherry" },
    ],
};

let mockQueryReturn = {
    data: mockData,
    isLoading: false,
    isError: false,
};

jest.mock("@tanstack/react-query", () => ({
    useQuery: () => mockQueryReturn,
}));

const defaultOptions = {
    basePath: "/test",
    queryKey: ["test"] as const,
    queryFn: jest.fn(),
    getRows: (data: typeof mockData) => data.items,
    filterRow: (row: { name: string }, lower: string) => row.name.toLowerCase().includes(lower),
    sortRow: (a: { name: string }, b: { name: string }, dir: SortDir) =>
        dir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
};

describe("useSortableTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockQueryReturn = { data: mockData, isLoading: false, isError: false };
    });

    it("returns sorted and paginated rows", () => {
        const { result } = renderHook(() => useSortableTable(defaultOptions));

        expect(result.current.paginatedRows[0].name).toBe("Apple");
        expect(result.current.paginatedRows[2].name).toBe("Cherry");
    });

    it("defaults sortDir to asc", () => {
        const { result } = renderHook(() => useSortableTable(defaultOptions));

        expect(result.current.sortDir).toBe("asc");
    });

    it("toggles sort direction", () => {
        const { result } = renderHook(() => useSortableTable(defaultOptions));

        act(() => {
            result.current.handleSortToggle();
        });

        expect(result.current.sortDir).toBe("desc");
        expect(result.current.paginatedRows[0].name).toBe("Cherry");
    });

    it("filters rows by search", () => {
        const { result } = renderHook(() => useSortableTable(defaultOptions));

        act(() => {
            result.current.state.onSearchChange("ban");
        });

        expect(result.current.paginatedRows).toHaveLength(1);
        expect(result.current.paginatedRows[0].name).toBe("Banana");
    });

    it("resets page to 1 on search change", () => {
        const { result } = renderHook(() => useSortableTable(defaultOptions));

        act(() => {
            result.current.state.onPageChange(2);
        });

        act(() => {
            result.current.state.onSearchChange("a");
        });

        expect(result.current.state.page).toBe(1);
    });

    it("returns isEmpty true when no data", () => {
        mockQueryReturn = {
            data: { items: [] } as unknown as typeof mockData,
            isLoading: false,
            isError: false,
        };

        const { result } = renderHook(() => useSortableTable(defaultOptions));

        expect(result.current.state.isEmpty).toBe(true);
    });

    it("returns isLoading from query", () => {
        mockQueryReturn = {
            data: undefined as unknown as typeof mockData,
            isLoading: true,
            isError: false,
        };

        const { result } = renderHook(() => useSortableTable(defaultOptions));

        expect(result.current.state.isLoading).toBe(true);
    });
});
