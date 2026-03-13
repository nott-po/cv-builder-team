import { render } from "@testing-library/react";

import { EmployeeTableSkeleton } from "@/components/shared/EmployeeTableSkeleton";

jest.mock("next-intl");

jest.mock("@/lib/hooks/useEmployeeTable", () => ({
    PAGE_SIZE_OPTIONS: [10, 20, 50],
}));

describe("EmployeeTableSkeleton Component", () => {
    it("renders without crashing with default props", () => {
        const { container } = render(<EmployeeTableSkeleton rows={10} />);
        expect(container).toBeInTheDocument();
    });

    it("renders with a different number of rows", () => {
        const { container } = render(<EmployeeTableSkeleton rows={5} />);
        expect(container).toBeInTheDocument();
    });
});
