import { renderHook } from "@testing-library/react";

import { useDepartments } from "@/lib/hooks/useDepartments";

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

const mockDepts = [
    { id: "1", name: "Engineering" },
    { id: "2", name: "HR" },
];

jest.mock("@tanstack/react-query", () => ({
    useQuery: (opts: { select?: (d: unknown) => unknown }) => {
        const data = { departments: mockDepts };
        return {
            data: opts.select ? opts.select(data) : data,
            isLoading: false,
            isError: false,
        };
    },
}));

describe("useDepartments", () => {
    it("returns department list via select transform", () => {
        const { result } = renderHook(() => useDepartments());

        expect(result.current.data).toEqual(mockDepts);
    });
});
