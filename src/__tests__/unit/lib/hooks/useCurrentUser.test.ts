import { useQuery, useQueryClient } from "@tanstack/react-query";
import { renderHook, act } from "@testing-library/react";

import apiClient from "@/lib/api/client";
import { UserRole } from "@/lib/constants/roles";
import { useCurrentUser, fetchCurrentUser, CURRENT_USER_KEY } from "@/lib/hooks/useCurrentUser";

jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(),
    useQueryClient: jest.fn(),
}));

jest.mock("@/lib/api/client", () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
    },
}));

describe("fetchCurrentUser", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns user data on successful API call", async () => {
        const mockUser = { id: "1", email: "test@test.com", role: "Employee" };
        (apiClient.get as jest.Mock).mockResolvedValueOnce({
            data: { user: mockUser },
        });

        const result = await fetchCurrentUser();

        expect(apiClient.get).toHaveBeenCalledWith("/auth/me");
        expect(result).toEqual(mockUser);
    });

    it("returns null when API returns no user", async () => {
        (apiClient.get as jest.Mock).mockResolvedValueOnce({
            data: { user: null },
        });

        const result = await fetchCurrentUser();

        expect(result).toBeNull();
    });

    it("returns null on API error instead of throwing", async () => {
        (apiClient.get as jest.Mock).mockRejectedValueOnce(new Error("401 Unauthorized"));

        const result = await fetchCurrentUser();

        expect(result).toBeNull();
    });

    it("returns null when response data has no user field", async () => {
        (apiClient.get as jest.Mock).mockResolvedValueOnce({
            data: {},
        });

        const result = await fetchCurrentUser();

        expect(result).toBeNull();
    });
});

describe("useCurrentUser hook", () => {
    const mockSetQueryData = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useQueryClient as jest.Mock).mockReturnValue({
            setQueryData: mockSetQueryData,
        });
    });

    it("returns user data when loaded", () => {
        const mockUser = { id: "1", email: "test@test.com", role: "Admin" };
        (useQuery as jest.Mock).mockReturnValue({
            data: mockUser,
            isLoading: false,
        });

        const { result } = renderHook(() => useCurrentUser());

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isLoading).toBe(false);
    });

    it("returns null user while loading", () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: true,
        });

        const { result } = renderHook(() => useCurrentUser());

        expect(result.current.user).toBeNull();
        expect(result.current.isLoading).toBe(true);
    });

    it("derives displayName from user email", () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: { id: "1", email: "john@example.com", role: "Employee" },
            isLoading: false,
        });

        const { result } = renderHook(() => useCurrentUser());

        expect(result.current.displayName).toBe("john@example.com");
    });

    it("derives initial from first letter of email (uppercased)", () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: { id: "1", email: "john@example.com", role: "Employee" },
            isLoading: false,
        });

        const { result } = renderHook(() => useCurrentUser());

        expect(result.current.initial).toBe("J");
    });

    it("returns '?' as initial when no user", () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
        });

        const { result } = renderHook(() => useCurrentUser());

        expect(result.current.initial).toBe("?");
        expect(result.current.displayName).toBe("");
    });

    it("setUser updates query cache with new user data", () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: null,
            isLoading: false,
        });

        const { result } = renderHook(() => useCurrentUser());

        const newUser = { id: "2", email: "new@test.com", role: UserRole.Admin };
        act(() => {
            result.current.setUser(newUser);
        });

        expect(mockSetQueryData).toHaveBeenCalledWith(CURRENT_USER_KEY, newUser);
    });

    it("clearUser sets query cache to null", () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: { id: "1", email: "test@test.com", role: "Employee" },
            isLoading: false,
        });

        const { result } = renderHook(() => useCurrentUser());

        act(() => {
            result.current.clearUser();
        });

        expect(mockSetQueryData).toHaveBeenCalledWith(CURRENT_USER_KEY, null);
    });

    it("configures useQuery with correct options", () => {
        (useQuery as jest.Mock).mockReturnValue({ data: null, isLoading: false });

        renderHook(() => useCurrentUser());

        expect(useQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: CURRENT_USER_KEY,
                staleTime: Infinity,
                gcTime: Infinity,
                retry: false,
            }),
        );
    });
});
