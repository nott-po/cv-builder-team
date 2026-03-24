export type SortDir = "asc" | "desc";

export type TableState = {
    isLoading: boolean;
    isError: boolean;
    isEmpty: boolean;
    search: string;
    onSearchChange: (value: string) => void;
    page: number;
    pageSize: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
};
