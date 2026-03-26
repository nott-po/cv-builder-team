import { renderHook, act } from "@testing-library/react";

import { useTablePagination } from "@/lib/hooks/useTablePagination";

const mockPush = jest.fn();

jest.mock("@/i18n/routing", () => ({
    useRouter: () => ({ push: mockPush }),
}));

let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
    useSearchParams: () => mockSearchParams,
}));

describe("useTablePagination", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSearchParams = new URLSearchParams();
    });

    it("defaults page to 1", () => {
        const { result } = renderHook(() => useTablePagination("/test"));

        expect(result.current.page).toBe(1);
    });

    it("defaults pageSize to DEFAULT_PAGE_SIZE when no URL param", () => {
        const { result } = renderHook(() => useTablePagination("/test"));

        expect(result.current.pageSize).toBe(10);
    });

    it("reads pageSize from URL search params", () => {
        mockSearchParams = new URLSearchParams("pageSize=25");

        const { result } = renderHook(() => useTablePagination("/test"));

        expect(result.current.pageSize).toBe(25);
    });

    it("handlePageChange updates the page", () => {
        const { result } = renderHook(() => useTablePagination("/test"));

        act(() => {
            result.current.handlePageChange(3);
        });

        expect(result.current.page).toBe(3);
    });

    it("handlePageSizeChange pushes URL with new pageSize and resets page", () => {
        const { result } = renderHook(() => useTablePagination("/test"));

        act(() => {
            result.current.handlePageChange(5);
        });

        act(() => {
            result.current.handlePageSizeChange(25);
        });

        expect(mockPush).toHaveBeenCalledWith("/test?pageSize=25");
        expect(result.current.page).toBe(1);
    });
});
