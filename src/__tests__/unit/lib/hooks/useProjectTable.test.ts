import { renderHook, act } from "@testing-library/react";

import { useProjectTable } from "@/lib/hooks/useProjectTable";

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

const mockProjects = {
    projects: [
        {
            id: "1",
            name: "Zebra",
            domain: "Web",
            start_date: "2024-01-01",
            end_date: null,
            description: "A web platform",
            environment: ["React", "Node.js"],
        },
        {
            id: "2",
            name: "Alpha",
            domain: "Mobile",
            start_date: "2024-02-01",
            end_date: "2024-12-01",
            description: "Mobile banking app",
            environment: ["Flutter"],
        },
        {
            id: "3",
            name: "Beta",
            domain: "DevOps",
            start_date: "2024-03-01",
            end_date: null,
            description: "CI/CD pipeline tools",
            environment: ["Docker", "K8s"],
        },
    ],
};

let mockQueryReturn: {
    data: typeof mockProjects | undefined;
    isLoading: boolean;
    isError: boolean;
} = {
    data: mockProjects,
    isLoading: false,
    isError: false,
};

jest.mock("@tanstack/react-query", () => ({
    useQuery: () => mockQueryReturn,
}));

describe("useProjectTable", () => {
    beforeEach(() => {
        mockQueryReturn = { data: mockProjects, isLoading: false, isError: false };
    });

    it("sorts projects by name ascending by default", () => {
        const { result } = renderHook(() => useProjectTable());

        const names = result.current.paginatedProjects.map((p) => p.name);
        expect(names).toEqual(["Alpha", "Beta", "Zebra"]);
        expect(result.current.sortDir).toBe("asc");
    });

    it("reverses sort order on toggle", () => {
        const { result } = renderHook(() => useProjectTable());

        act(() => {
            result.current.handleSortToggle();
        });

        expect(result.current.sortDir).toBe("desc");
        const names = result.current.paginatedProjects.map((p) => p.name);
        expect(names).toEqual(["Zebra", "Beta", "Alpha"]);
    });

    it("filters by project name", () => {
        const { result } = renderHook(() => useProjectTable());

        act(() => {
            result.current.state.onSearchChange("alpha");
        });

        expect(result.current.paginatedProjects).toHaveLength(1);
        expect(result.current.paginatedProjects[0].name).toBe("Alpha");
    });

    it("filters by domain", () => {
        const { result } = renderHook(() => useProjectTable());

        act(() => {
            result.current.state.onSearchChange("devops");
        });

        expect(result.current.paginatedProjects).toHaveLength(1);
        expect(result.current.paginatedProjects[0].name).toBe("Beta");
    });

    it("filters by description", () => {
        const { result } = renderHook(() => useProjectTable());

        act(() => {
            result.current.state.onSearchChange("banking");
        });

        expect(result.current.paginatedProjects).toHaveLength(1);
        expect(result.current.paginatedProjects[0].name).toBe("Alpha");
    });

    it("returns empty when search matches nothing", () => {
        const { result } = renderHook(() => useProjectTable());

        act(() => {
            result.current.state.onSearchChange("xyz");
        });

        expect(result.current.paginatedProjects).toHaveLength(0);
        expect(result.current.state.isEmpty).toBe(true);
    });

    it("returns empty rows when data is undefined", () => {
        mockQueryReturn = { data: undefined, isLoading: true, isError: false };

        const { result } = renderHook(() => useProjectTable());

        expect(result.current.paginatedProjects).toHaveLength(0);
        expect(result.current.state.isLoading).toBe(true);
    });
});
