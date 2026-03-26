import { renderHook } from "@testing-library/react";

import { useProfileLanguages } from "@/lib/hooks/useProfileLanguages";
import { useProfileSkills } from "@/lib/hooks/useProfileSkills";
import { useUserData } from "@/lib/hooks/useUserData";

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

let mockQueryReturn: Record<string, unknown> = {};

jest.mock("@tanstack/react-query", () => ({
    useQuery: (opts: { enabled?: boolean; select?: (d: unknown) => unknown }) => {
        if (opts.select && mockQueryReturn.data) {
            return { ...mockQueryReturn, data: opts.select(mockQueryReturn.data) };
        }
        return mockQueryReturn;
    },
}));

describe("useProfileSkills", () => {
    it("returns skills from profile query", () => {
        mockQueryReturn = {
            data: { profile: { id: "p1", skills: [{ name: "React", mastery: "Skillful" }] } },
            isLoading: false,
            isError: false,
        };

        const { result } = renderHook(() => useProfileSkills("user-1"));

        expect(result.current.skills).toEqual([{ name: "React", mastery: "Skillful" }]);
    });

    it("returns empty array when no data", () => {
        mockQueryReturn = { data: undefined, isLoading: true, isError: false };

        const { result } = renderHook(() => useProfileSkills("user-1"));

        expect(result.current.skills).toEqual([]);
        expect(result.current.isLoading).toBe(true);
    });
});

describe("useProfileLanguages", () => {
    it("returns languages from profile query", () => {
        mockQueryReturn = {
            data: {
                profile: { id: "p1", languages: [{ name: "English", proficiency: "Native" }] },
            },
            isLoading: false,
            isError: false,
        };

        const { result } = renderHook(() => useProfileLanguages("user-1"));

        expect(result.current.languages).toEqual([{ name: "English", proficiency: "Native" }]);
    });

    it("returns empty array when no data", () => {
        mockQueryReturn = { data: undefined, isLoading: false, isError: true };

        const { result } = renderHook(() => useProfileLanguages("user-1"));

        expect(result.current.languages).toEqual([]);
        expect(result.current.isError).toBe(true);
    });
});

describe("useUserData", () => {
    it("returns user details via select transform", () => {
        const mockUser = {
            id: "u1",
            email: "test@test.com",
            created_at: "123",
            department_name: "Eng",
            position_name: "Dev",
            profile: { first_name: "John", last_name: "Doe", avatar: null },
        };
        mockQueryReturn = {
            data: { user: mockUser },
            isLoading: false,
            isError: false,
        };

        const { result } = renderHook(() => useUserData("u1"));

        expect(result.current.data).toEqual(mockUser);
    });
});
