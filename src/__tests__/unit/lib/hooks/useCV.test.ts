import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";

import { useCv, cvDetailKey } from "@/lib/hooks/useCV";

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn(),
}));

const mockCv = {
    id: "cv-1",
    created_at: "2024-01-01",
    name: "Test CV",
    education: "MIT",
    description: "A great CV",
    user: {
        id: "u1",
        email: "test@test.com",
        position_name: "Developer",
        profile: { full_name: "John Doe" },
    },
    projects: [],
    skills: [],
    languages: [],
};

describe("useCv", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns cv data when loaded", () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: mockCv,
            isLoading: false,
            isError: false,
            refetch: jest.fn(),
        });

        const { result } = renderHook(() => useCv("cv-1"));

        expect(result.current.cv).toEqual(mockCv);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
    });

    it("returns loading state", () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
            refetch: jest.fn(),
        });

        const { result } = renderHook(() => useCv("cv-1"));

        expect(result.current.cv).toBeUndefined();
        expect(result.current.isLoading).toBe(true);
    });

    it("returns error state", () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            refetch: jest.fn(),
        });

        const { result } = renderHook(() => useCv("cv-1"));

        expect(result.current.isError).toBe(true);
    });

    it("configures useQuery with correct query key and enabled option", () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
            refetch: jest.fn(),
        });

        renderHook(() => useCv("cv-1"));

        expect(useQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ["cv", "detail", "cv-1"],
                enabled: true,
            }),
        );
    });

    it("disables query when cvId is empty", () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
            refetch: jest.fn(),
        });

        renderHook(() => useCv(""));

        expect(useQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                enabled: false,
            }),
        );
    });

    it("exposes refetch from useQuery", () => {
        const mockRefetch = jest.fn();
        (useQuery as jest.Mock).mockReturnValue({
            data: mockCv,
            isLoading: false,
            isError: false,
            refetch: mockRefetch,
        });

        const { result } = renderHook(() => useCv("cv-1"));

        expect(result.current.refetch).toBe(mockRefetch);
    });
});

describe("cvDetailKey", () => {
    it("returns correct query key", () => {
        expect(cvDetailKey("cv-123")).toEqual(["cv", "detail", "cv-123"]);
    });
});
