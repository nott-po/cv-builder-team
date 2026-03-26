import { renderHook, act } from "@testing-library/react";

import { useSkillTable } from "@/lib/hooks/useSkillTable";

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

const mockSkills = {
    skills: [
        {
            id: "1",
            name: "React",
            category_name: "Frontend",
            category_parent_name: "Software",
            category: { id: "c1", name: "Frontend" },
        },
        {
            id: "2",
            name: "Node.js",
            category_name: "Backend",
            category_parent_name: "Software",
            category: { id: "c2", name: "Backend" },
        },
        {
            id: "3",
            name: "Figma",
            category_name: "Design Tools",
            category_parent_name: null,
            category: { id: "c3", name: "Design Tools" },
        },
    ],
};

let mockQueryReturn: {
    data: typeof mockSkills | undefined;
    isLoading: boolean;
    isError: boolean;
} = {
    data: mockSkills,
    isLoading: false,
    isError: false,
};

jest.mock("@tanstack/react-query", () => ({
    useQuery: () => mockQueryReturn,
}));

describe("useSkillTable", () => {
    beforeEach(() => {
        mockQueryReturn = { data: mockSkills, isLoading: false, isError: false };
    });

    it("sorts by category_parent_name ascending by default", () => {
        const { result } = renderHook(() => useSkillTable());

        const names = result.current.paginatedSkills.map((s) => s.name);
        // null category_parent_name ("") sorts first, then "Software" items
        expect(names[0]).toBe("Figma");
        expect(result.current.sortDir).toBe("asc");
    });

    it("reverses sort order on toggle", () => {
        const { result } = renderHook(() => useSkillTable());

        act(() => {
            result.current.handleSortToggle();
        });

        expect(result.current.sortDir).toBe("desc");
        const names = result.current.paginatedSkills.map((s) => s.name);
        // "Software" items come first in desc, then "" (null)
        expect(names[names.length - 1]).toBe("Figma");
    });

    it("filters by skill name", () => {
        const { result } = renderHook(() => useSkillTable());

        act(() => {
            result.current.state.onSearchChange("react");
        });

        expect(result.current.paginatedSkills).toHaveLength(1);
        expect(result.current.paginatedSkills[0].name).toBe("React");
    });

    it("filters by category_name", () => {
        const { result } = renderHook(() => useSkillTable());

        act(() => {
            result.current.state.onSearchChange("backend");
        });

        expect(result.current.paginatedSkills).toHaveLength(1);
        expect(result.current.paginatedSkills[0].name).toBe("Node.js");
    });

    it("filters by category_parent_name", () => {
        const { result } = renderHook(() => useSkillTable());

        act(() => {
            result.current.state.onSearchChange("software");
        });

        expect(result.current.paginatedSkills).toHaveLength(2);
    });

    it("handles null category fields in filter without crashing", () => {
        const { result } = renderHook(() => useSkillTable());

        act(() => {
            result.current.state.onSearchChange("figma");
        });

        expect(result.current.paginatedSkills).toHaveLength(1);
        expect(result.current.paginatedSkills[0].category_parent_name).toBeNull();
    });

    it("returns empty rows when data is undefined", () => {
        mockQueryReturn = { data: undefined, isLoading: true, isError: false };

        const { result } = renderHook(() => useSkillTable());

        expect(result.current.paginatedSkills).toHaveLength(0);
        expect(result.current.state.isLoading).toBe(true);
    });
});
