import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { renderHook, act } from "@testing-library/react";

import { useRouter } from "@/i18n/routing";
import { useEmployeeTable } from "@/lib/hooks/useEmployeeTable";

jest.mock("next/navigation", () => ({
    useSearchParams: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(),
}));

jest.mock("@/i18n/routing", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@/lib/graphql/fetcher", () => ({
    fetcher: jest.fn(() => jest.fn()),
}));

describe("useEmployeeTable hook", () => {
    const mockRouterPush = jest.fn();
    const mockSearchParamsGet = jest.fn();

    const mockUsers = [
        {
            id: "1",
            email: "alice@example.com",
            department_name: "Engineering",
            position_name: "Developer",
            profile: { first_name: "Alice", last_name: "Smith", avatar: null },
        },
        {
            id: "2",
            email: "bob@example.com",
            department_name: "HR",
            position_name: "Manager",
            profile: { first_name: "Bob", last_name: "Jones", avatar: null },
        },
        {
            id: "3",
            email: "charlie@example.com",
            department_name: null,
            position_name: null,
            profile: { first_name: null, last_name: null, avatar: null },
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });

        (useSearchParams as jest.Mock).mockReturnValue({
            get: mockSearchParamsGet,
            toString: () => "",
        });

        (useQuery as jest.Mock).mockReturnValue({
            data: { users: mockUsers },
            isLoading: false,
            isError: false,
        });
    });

    it("initializes with default values and sorts by department ascending", () => {
        const { result } = renderHook(() => useEmployeeTable());

        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.search).toBe("");
        expect(result.current.sortDir).toBe("asc");
        expect(result.current.page).toBe(1);
        expect(result.current.pageSize).toBe(10);
        expect(result.current.paginatedEmployees[0].id).toBe("3");
        expect(result.current.paginatedEmployees[1].id).toBe("1");
        expect(result.current.paginatedEmployees[2].id).toBe("2");
    });

    it("returns empty arrays and handles missing data gracefully", () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: null,
            isLoading: true,
            isError: false,
        });

        const { result } = renderHook(() => useEmployeeTable());

        expect(result.current.paginatedEmployees).toEqual([]);
        expect(result.current.totalPages).toBe(1);
    });

    it("filters employees based on search input and resets page", () => {
        const { result } = renderHook(() => useEmployeeTable());

        act(() => {
            result.current.setPage(2);
        });
        expect(result.current.page).toBe(2);

        act(() => {
            result.current.handleSearchChange("alice");
        });

        expect(result.current.search).toBe("alice");
        expect(result.current.page).toBe(1);
        expect(result.current.paginatedEmployees).toHaveLength(1);
        expect(result.current.paginatedEmployees[0].email).toBe("alice@example.com");
    });

    it("toggles sorting direction and resets page", () => {
        const { result } = renderHook(() => useEmployeeTable());

        act(() => {
            result.current.setPage(2);
            result.current.handleSortToggle();
        });

        expect(result.current.sortDir).toBe("desc");
        expect(result.current.page).toBe(1);

        expect(result.current.paginatedEmployees[0].id).toBe("2");
        expect(result.current.paginatedEmployees[1].id).toBe("1");
        expect(result.current.paginatedEmployees[2].id).toBe("3");
    });

    it("handles page size changes and updates URL params", () => {
        const { result } = renderHook(() => useEmployeeTable());

        act(() => {
            result.current.handlePageSizeChange(25);
        });

        expect(mockRouterPush).toHaveBeenCalledWith("/employees?pageSize=25");
        expect(result.current.page).toBe(1);
    });

    it("handles row clicks and navigates to the employee profile", () => {
        const { result } = renderHook(() => useEmployeeTable());

        act(() => {
            result.current.handleRowClick("123-abc");
        });

        expect(mockRouterPush).toHaveBeenCalledWith("/employees/123-abc");
    });

    it("calculates pagination correctly based on page size from URL", () => {
        mockSearchParamsGet.mockReturnValue("2");

        const { result } = renderHook(() => useEmployeeTable());

        expect(result.current.pageSize).toBe(2);
        expect(result.current.totalPages).toBe(2); // 3 items / 2 per page = 2 pages
        expect(result.current.paginatedEmployees).toHaveLength(2);

        act(() => {
            result.current.setPage(2);
        });

        expect(result.current.paginatedEmployees).toHaveLength(1);
    });
});
