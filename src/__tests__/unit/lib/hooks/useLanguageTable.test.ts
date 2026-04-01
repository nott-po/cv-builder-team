import { renderHook, act } from "@testing-library/react";

import { useLanguageTable } from "@/lib/hooks/useLanguageTable";

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

const mockLanguages = {
    languages: [
        { id: "1", iso2: "EN", name: "English", native_name: "English" },
        { id: "2", iso2: "PL", name: "Polish", native_name: "Polski" },
        { id: "3", iso2: "JA", name: "Japanese", native_name: null },
    ],
};

let mockQueryReturn: {
    data: typeof mockLanguages | undefined;
    isLoading: boolean;
    isError: boolean;
} = {
    data: mockLanguages,
    isLoading: false,
    isError: false,
};

jest.mock("@tanstack/react-query", () => ({
    useQuery: () => mockQueryReturn,
}));

describe("useLanguageTable", () => {
    beforeEach(() => {
        mockQueryReturn = { data: mockLanguages, isLoading: false, isError: false };
    });

    it("returns all languages when no search is active", () => {
        const { result } = renderHook(() => useLanguageTable());

        expect(result.current.paginatedLanguages).toHaveLength(3);
    });

    it("filters by name field", () => {
        const { result } = renderHook(() => useLanguageTable());

        act(() => {
            result.current.state.onSearchChange("polish");
        });

        expect(result.current.paginatedLanguages).toHaveLength(1);
        expect(result.current.paginatedLanguages[0].name).toBe("Polish");
    });

    it("filters by iso2 field", () => {
        const { result } = renderHook(() => useLanguageTable());

        act(() => {
            result.current.state.onSearchChange("JA");
        });

        expect(result.current.paginatedLanguages).toHaveLength(1);
        expect(result.current.paginatedLanguages[0].name).toBe("Japanese");
    });

    it("filters by native_name field", () => {
        const { result } = renderHook(() => useLanguageTable());

        act(() => {
            result.current.state.onSearchChange("Polski");
        });

        expect(result.current.paginatedLanguages).toHaveLength(1);
        expect(result.current.paginatedLanguages[0].name).toBe("Polish");
    });

    it("handles null native_name without crashing", () => {
        const { result } = renderHook(() => useLanguageTable());

        act(() => {
            result.current.state.onSearchChange("japanese");
        });

        expect(result.current.paginatedLanguages).toHaveLength(1);
        expect(result.current.paginatedLanguages[0].native_name).toBeNull();
    });

    it("returns empty when search matches no field", () => {
        const { result } = renderHook(() => useLanguageTable());

        act(() => {
            result.current.state.onSearchChange("xyz");
        });

        expect(result.current.paginatedLanguages).toHaveLength(0);
        expect(result.current.state.isEmpty).toBe(true);
    });

    it("returns empty rows when data is undefined", () => {
        mockQueryReturn = { data: undefined, isLoading: true, isError: false };

        const { result } = renderHook(() => useLanguageTable());

        expect(result.current.paginatedLanguages).toHaveLength(0);
        expect(result.current.state.isLoading).toBe(true);
    });
});
