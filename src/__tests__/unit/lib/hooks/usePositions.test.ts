import { renderHook } from "@testing-library/react";

import { usePositions } from "@/lib/hooks/usePositions";

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

const mockPositions = [
    { id: "1", name: "Developer" },
    { id: "2", name: "Manager" },
];

jest.mock("@tanstack/react-query", () => ({
    useQuery: (opts: { select?: (d: unknown) => unknown }) => {
        const data = { positions: mockPositions };
        return {
            data: opts.select ? opts.select(data) : data,
            isLoading: false,
            isError: false,
        };
    },
}));

describe("usePositions", () => {
    it("returns position list via select transform", () => {
        const { result } = renderHook(() => usePositions());

        expect(result.current.data).toEqual(mockPositions);
    });
});
