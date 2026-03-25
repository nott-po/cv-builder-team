import { useSearchParams } from "next/navigation";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { renderHook, act } from "@testing-library/react";

import { useRouter } from "@/i18n/routing";
import { useEmployeeTable } from "@/lib/hooks/useEmployeeTable";

jest.mock("next/navigation", () => ({
    useSearchParams: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(),
    useQueryClient: jest.fn(),
}));

jest.mock("@/i18n/routing", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

const mockRouterPush = jest.fn();
const mockSearchParamsGet = jest.fn();
const mockSetQueryData = jest.fn();

const mockUsers = [
    {
        id: "1",
        email: "alice@example.com",
        role: "Employee",
        department_name: "Engineering",
        position_name: "Developer",
        profile: { first_name: "Alice", last_name: "Smith", avatar: null },
    },
    {
        id: "2",
        email: "bob@example.com",
        role: "Employee",
        department_name: "HR",
        position_name: "Manager",
        profile: { first_name: "Bob", last_name: "Jones", avatar: null },
    },
    {
        id: "3",
        email: "charlie@example.com",
        role: "Employee",
        department_name: null,
        position_name: null,
        profile: { first_name: null, last_name: null, avatar: null },
    },
];

describe("useEmployeeTable hook", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });

        (useSearchParams as jest.Mock).mockReturnValue({
            get: mockSearchParamsGet,
            toString: () => "",
        });

        (useQueryClient as jest.Mock).mockReturnValue({
            setQueryData: mockSetQueryData,
        });

        // useQuery is called twice: once by useCurrentUser, once by useSortableTable
        (useQuery as jest.Mock)
            .mockReturnValueOnce({
                // useCurrentUser query
                data: { id: "current-user", email: "me@test.com" },
                isLoading: false,
            })
            .mockReturnValueOnce({
                // useSortableTable query (employees)
                data: { users: mockUsers },
                isLoading: false,
                isError: false,
            });
    });

    it("returns employee data with default descending sort by department", () => {
        const { result } = renderHook(() => useEmployeeTable());

        expect(result.current.state.isLoading).toBe(false);
        expect(result.current.state.isError).toBe(false);
        expect(result.current.sortDir).toBe("desc");
        expect(result.current.paginatedEmployees).toHaveLength(3);
        // desc sort: HR > Engineering > null
        expect(result.current.paginatedEmployees[0].id).toBe("2");
        expect(result.current.paginatedEmployees[1].id).toBe("1");
        expect(result.current.paginatedEmployees[2].id).toBe("3");
    });

    it("returns empty array when data is not yet loaded", () => {
        (useQuery as jest.Mock)
            .mockReset()
            .mockReturnValueOnce({ data: null, isLoading: false })
            .mockReturnValueOnce({ data: null, isLoading: true, isError: false });

        const { result } = renderHook(() => useEmployeeTable());

        expect(result.current.paginatedEmployees).toEqual([]);
        expect(result.current.state.totalPages).toBe(1);
    });

    it("navigates to /profile when clicking own user row", () => {
        (useQuery as jest.Mock)
            .mockReset()
            .mockReturnValueOnce({
                data: { id: "1", email: "alice@example.com" },
                isLoading: false,
            })
            .mockReturnValueOnce({
                data: { users: mockUsers },
                isLoading: false,
                isError: false,
            });

        const { result } = renderHook(() => useEmployeeTable());

        act(() => {
            result.current.handleRowClick("1");
        });

        expect(mockRouterPush).toHaveBeenCalledWith("/profile");
    });

    it("navigates to employee detail page when clicking another user row", () => {
        const { result } = renderHook(() => useEmployeeTable());

        act(() => {
            result.current.handleRowClick("2");
        });

        expect(mockRouterPush).toHaveBeenCalledWith("/employees/2");
    });

    it("uses custom basePath for navigation", () => {
        const { result } = renderHook(() => useEmployeeTable("/admin/employees"));

        act(() => {
            result.current.handleRowClick("2");
        });

        expect(mockRouterPush).toHaveBeenCalledWith("/admin/employees/2");
    });
});
