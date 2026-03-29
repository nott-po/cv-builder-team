import { renderHook, act } from "@testing-library/react";

import { usePositionTable } from "@/lib/hooks/usePositionTable";

const mockPush = jest.fn();
jest.mock("@/i18n/routing", () => ({
    useRouter: () => ({ push: mockPush }),
}));
jest.mock("next/navigation", () => ({
    useSearchParams: () => new URLSearchParams(),
}));

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

const mockPositions = {
    positions: [
        { id: "1", name: "Senior Developer" },
        { id: "2", name: "Junior Designer" },
        { id: "3", name: "Project Manager" },
    ],
};

let mockQueryReturn: {
    data: typeof mockPositions | undefined;
    isLoading: boolean;
    isError: boolean;
} = {
    data: mockPositions,
    isLoading: false,
    isError: false,
};

jest.mock("@tanstack/react-query", () => ({
    useQuery: () => mockQueryReturn,
}));

describe("usePositionTable", () => {
    beforeEach(() => {
        mockQueryReturn = { data: mockPositions, isLoading: false, isError: false };
    });

    it("returns all positions when no search is active", () => {
        const { result } = renderHook(() => usePositionTable());

        expect(result.current.paginatedPositions).toHaveLength(3);
        expect(result.current.paginatedPositions[0].name).toBe("Senior Developer");
    });

    it("filters positions by name (case-insensitive)", () => {
        const { result } = renderHook(() => usePositionTable());

        act(() => {
            result.current.state.onSearchChange("DEVELOPER");
        });

        expect(result.current.paginatedPositions).toHaveLength(1);
        expect(result.current.paginatedPositions[0].name).toBe("Senior Developer");
    });

    it("filters by partial name match", () => {
        const { result } = renderHook(() => usePositionTable());

        act(() => {
            result.current.state.onSearchChange("junior");
        });

        expect(result.current.paginatedPositions).toHaveLength(1);
        expect(result.current.paginatedPositions[0].name).toBe("Junior Designer");
    });

    it("returns empty when search matches nothing", () => {
        const { result } = renderHook(() => usePositionTable());

        act(() => {
            result.current.state.onSearchChange("xyz");
        });

        expect(result.current.paginatedPositions).toHaveLength(0);
        expect(result.current.state.isEmpty).toBe(true);
    });

    it("returns empty rows when data is undefined", () => {
        mockQueryReturn = { data: undefined, isLoading: true, isError: false };

        const { result } = renderHook(() => usePositionTable());

        expect(result.current.paginatedPositions).toHaveLength(0);
        expect(result.current.state.isLoading).toBe(true);
    });
});
