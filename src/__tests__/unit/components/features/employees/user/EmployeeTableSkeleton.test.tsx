import { render, screen } from "@testing-library/react";

import { EmployeeTableSkeleton } from "@/components/features/employees/user/EmployeeTableSkeleton";

jest.mock("@/components/shared/TablePaginationSkeleton", () => ({
    TablePaginationSkeleton: () => <div data-testid="pagination-skeleton" />,
}));

describe("EmployeeTableSkeleton Component", () => {
    it("renders the correct number of skeleton rows", () => {
        const { container } = render(<EmployeeTableSkeleton rows={5} />);

        const rows = container.querySelectorAll("tbody tr");
        expect(rows).toHaveLength(5);
    });

    it("renders default row count when no prop given", () => {
        const { container } = render(<EmployeeTableSkeleton />);

        const rows = container.querySelectorAll("tbody tr");
        expect(rows).toHaveLength(10);
    });

    it("renders table header skeleton cells", () => {
        const { container } = render(<EmployeeTableSkeleton rows={1} />);

        const headerCells = container.querySelectorAll("thead th");
        expect(headerCells.length).toBe(7);
    });

    it("renders pagination skeleton", () => {
        render(<EmployeeTableSkeleton rows={1} />);

        expect(screen.getByTestId("pagination-skeleton")).toBeInTheDocument();
    });
});
