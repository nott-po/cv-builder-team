import { useQuery } from "@tanstack/react-query";
import { renderHook, act } from "@testing-library/react";

import { useCVTable } from "@/lib/hooks/useCVTable";

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

jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(),
}));

const mockCvs = [
    {
        id: "1",
        created_at: "2024-01-01",
        name: "Zebra CV",
        education: "MIT",
        description: "A web developer CV",
        user: { id: "u1", email: "zebra@test.com" },
    },
    {
        id: "2",
        created_at: "2024-02-01",
        name: "Alpha CV",
        education: "Stanford",
        description: "A mobile developer CV",
        user: { id: "u1", email: "alpha@test.com" },
    },
    {
        id: "3",
        created_at: "2024-03-01",
        name: "Beta CV",
        education: null,
        description: "A devops engineer CV",
        user: { id: "u1", email: "beta@test.com" },
    },
];

function mockQueryData(
    overrides?: Partial<{ data: typeof mockCvs | undefined; isLoading: boolean; isError: boolean }>,
) {
    (useQuery as jest.Mock).mockReturnValue({
        data: mockCvs,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        ...overrides,
    });
}

describe("useCVTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockQueryData();
    });

    it("sorts CVs by name ascending by default", () => {
        const { result } = renderHook(() => useCVTable("user-1"));

        const names = result.current.paginatedCvs.map((cv) => cv.name);
        expect(names).toEqual(["Alpha CV", "Beta CV", "Zebra CV"]);
        expect(result.current.sortDir).toBe("asc");
    });

    it("reverses sort order on toggle", () => {
        const { result } = renderHook(() => useCVTable("user-1"));

        act(() => {
            result.current.handleSortToggle();
        });

        expect(result.current.sortDir).toBe("desc");
        const names = result.current.paginatedCvs.map((cv) => cv.name);
        expect(names).toEqual(["Zebra CV", "Beta CV", "Alpha CV"]);
    });

    it("filters by CV name", () => {
        const { result } = renderHook(() => useCVTable("user-1"));

        act(() => {
            result.current.handleSearchChange("alpha");
        });

        expect(result.current.paginatedCvs).toHaveLength(1);
        expect(result.current.paginatedCvs[0].name).toBe("Alpha CV");
    });

    it("filters by description", () => {
        const { result } = renderHook(() => useCVTable("user-1"));

        act(() => {
            result.current.handleSearchChange("devops");
        });

        expect(result.current.paginatedCvs).toHaveLength(1);
        expect(result.current.paginatedCvs[0].name).toBe("Beta CV");
    });

    it("filters by email", () => {
        const { result } = renderHook(() => useCVTable("user-1"));

        act(() => {
            result.current.handleSearchChange("zebra@");
        });

        expect(result.current.paginatedCvs).toHaveLength(1);
        expect(result.current.paginatedCvs[0].name).toBe("Zebra CV");
    });

    it("returns empty when search matches nothing", () => {
        const { result } = renderHook(() => useCVTable("user-1"));

        act(() => {
            result.current.handleSearchChange("xyz-nothing");
        });

        expect(result.current.paginatedCvs).toHaveLength(0);
    });

    it("returns empty rows when data is undefined (loading)", () => {
        mockQueryData({ data: undefined, isLoading: true });

        const { result } = renderHook(() => useCVTable("user-1"));

        expect(result.current.paginatedCvs).toHaveLength(0);
        expect(result.current.isLoading).toBe(true);
    });

    it("navigates on row click", () => {
        const { result } = renderHook(() => useCVTable("user-1", "/cvs"));

        act(() => {
            result.current.handleRowClick("cv-123");
        });

        expect(mockPush).toHaveBeenCalledWith("/cvs/cv-123");
    });

    it("resets page on search change", () => {
        const { result } = renderHook(() => useCVTable("user-1"));

        act(() => {
            result.current.handlePageChange(2);
        });

        act(() => {
            result.current.handleSearchChange("test");
        });

        expect(result.current.page).toBe(1);
    });

    it("resets page on sort toggle", () => {
        const { result } = renderHook(() => useCVTable("user-1"));

        act(() => {
            result.current.handlePageChange(2);
        });

        act(() => {
            result.current.handleSortToggle();
        });

        expect(result.current.page).toBe(1);
    });

    it("configures useQuery with correct query key", () => {
        renderHook(() => useCVTable("user-1"));

        expect(useQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ["cvs", "user-1"],
                enabled: true,
            }),
        );
    });

    it("disables query when userId is empty", () => {
        renderHook(() => useCVTable(""));

        expect(useQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                enabled: false,
            }),
        );
    });
});
