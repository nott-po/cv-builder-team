import { renderHook, act } from "@testing-library/react";

import { useDepartmentTable } from "@/lib/hooks/useDepartmentTable";

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

const mockDepartments = {
    departments: [
        { id: "1", name: "Engineering" },
        { id: "2", name: "Human Resources" },
        { id: "3", name: "Marketing" },
    ],
};

let mockQueryReturn: {
    data: typeof mockDepartments | undefined;
    isLoading: boolean;
    isError: boolean;
} = {
    data: mockDepartments,
    isLoading: false,
    isError: false,
};

jest.mock("@tanstack/react-query", () => ({
    useQuery: () => mockQueryReturn,
}));

describe("useDepartmentTable", () => {
    beforeEach(() => {
        mockQueryReturn = { data: mockDepartments, isLoading: false, isError: false };
    });

    it("returns all departments when no search is active", () => {
        const { result } = renderHook(() => useDepartmentTable());

        expect(result.current.paginatedDepartments).toHaveLength(3);
        expect(result.current.paginatedDepartments[0].name).toBe("Engineering");
    });

    it("filters departments by name (case-insensitive)", () => {
        const { result } = renderHook(() => useDepartmentTable());

        act(() => {
            result.current.state.onSearchChange("ENGINEER");
        });

        expect(result.current.paginatedDepartments).toHaveLength(1);
        expect(result.current.paginatedDepartments[0].name).toBe("Engineering");
    });

    it("filters by partial name match", () => {
        const { result } = renderHook(() => useDepartmentTable());

        act(() => {
            result.current.state.onSearchChange("man");
        });

        expect(result.current.paginatedDepartments).toHaveLength(1);
        expect(result.current.paginatedDepartments[0].name).toBe("Human Resources");
    });

    it("returns empty when search matches nothing", () => {
        const { result } = renderHook(() => useDepartmentTable());

        act(() => {
            result.current.state.onSearchChange("xyz");
        });

        expect(result.current.paginatedDepartments).toHaveLength(0);
        expect(result.current.state.isEmpty).toBe(true);
    });

    it("returns empty rows when data is undefined", () => {
        mockQueryReturn = { data: undefined, isLoading: true, isError: false };

        const { result } = renderHook(() => useDepartmentTable());

        expect(result.current.paginatedDepartments).toHaveLength(0);
        expect(result.current.state.isLoading).toBe(true);
    });
});
