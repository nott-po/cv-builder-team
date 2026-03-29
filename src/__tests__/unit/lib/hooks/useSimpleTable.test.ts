import { renderHook, act } from "@testing-library/react";

import { useSimpleTable } from "@/lib/hooks/useSimpleTable";

const mockPush = jest.fn();
jest.mock("@/i18n/routing", () => ({
    useRouter: () => ({ push: mockPush }),
}));
jest.mock("next/navigation", () => ({
    useSearchParams: () => new URLSearchParams(),
}));

const mockData = {
    items: [
        { id: "1", name: "Engineering" },
        { id: "2", name: "HR" },
        { id: "3", name: "Marketing" },
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
};

describe("useSimpleTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockQueryReturn = { data: mockData, isLoading: false, isError: false };
    });

    it("returns all rows when no search", () => {
        const { result } = renderHook(() => useSimpleTable(defaultOptions));

        expect(result.current.paginatedRows).toHaveLength(3);
    });

    it("filters rows by search term", () => {
        const { result } = renderHook(() => useSimpleTable(defaultOptions));

        act(() => {
            result.current.state.onSearchChange("eng");
        });

        expect(result.current.paginatedRows).toHaveLength(1);
        expect(result.current.paginatedRows[0].name).toBe("Engineering");
    });

    it("returns isEmpty true when filtered results are empty", () => {
        const { result } = renderHook(() => useSimpleTable(defaultOptions));

        act(() => {
            result.current.state.onSearchChange("xyz");
        });

        expect(result.current.state.isEmpty).toBe(true);
    });

    it("resets page on search change", () => {
        const { result } = renderHook(() => useSimpleTable(defaultOptions));

        act(() => {
            result.current.state.onPageChange(2);
        });

        act(() => {
            result.current.state.onSearchChange("h");
        });

        expect(result.current.state.page).toBe(1);
    });

    it("computes totalPages based on rows and pageSize", () => {
        const { result } = renderHook(() => useSimpleTable(defaultOptions));

        // 3 items, pageSize=10, totalPages=1
        expect(result.current.state.totalPages).toBe(1);
    });
});
