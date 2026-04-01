import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Pagination } from "@/components/shared/Pagination";

jest.mock("next-intl");

jest.mock("@/components/ui/select", () => ({
    Select: ({
        value,
        onValueChange,
        children,
    }: {
        value?: string;
        onValueChange?: (v: string) => void;
        children: React.ReactNode;
    }) => (
        <select
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            data-testid="page-size-select"
        >
            {children}
        </select>
    ),
    SelectTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SelectValue: () => null,
    SelectContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SelectItem: ({ value, children }: { value: string; children: React.ReactNode }) => (
        <option value={value}>{children}</option>
    ),
}));

describe("Pagination Component", () => {
    const defaultProps = {
        page: 2,
        totalPages: 5,
        pageSize: 10,
        pageSizeOptions: [10, 20, 50],
        onPageChange: jest.fn(),
        onPageSizeChange: jest.fn(),
        rowsPerPageLabel: "Rows per page:",
        pageLabel: "Page 2 of 5",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders pagination controls and labels correctly", () => {
        render(<Pagination {...defaultProps} />);

        expect(screen.getByText("Rows per page:")).toBeInTheDocument();
        expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();

        expect(screen.getByRole("button", { name: "first_page" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "previous_page" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "next_page" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "last_page" })).toBeInTheDocument();
    });

    it("disables previous and first page buttons when on the first page", () => {
        render(<Pagination {...defaultProps} page={1} />);

        expect(screen.getByRole("button", { name: "first_page" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "previous_page" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "next_page" })).not.toBeDisabled();
        expect(screen.getByRole("button", { name: "last_page" })).not.toBeDisabled();
    });

    it("disables next and last page buttons when on the last page", () => {
        render(<Pagination {...defaultProps} page={5} />);

        expect(screen.getByRole("button", { name: "next_page" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "last_page" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "first_page" })).not.toBeDisabled();
        expect(screen.getByRole("button", { name: "previous_page" })).not.toBeDisabled();
    });

    it("calls onPageChange with correct values when navigation buttons are clicked", async () => {
        const user = userEvent.setup();
        render(<Pagination {...defaultProps} />);

        await user.click(screen.getByRole("button", { name: "first_page" }));
        await user.click(screen.getByRole("button", { name: "previous_page" }));
        await user.click(screen.getByRole("button", { name: "next_page" }));
        await user.click(screen.getByRole("button", { name: "last_page" }));

        expect(defaultProps.onPageChange).toHaveBeenNthCalledWith(1, 1); // first page
        expect(defaultProps.onPageChange).toHaveBeenNthCalledWith(2, 1); // previous (2-1)
        expect(defaultProps.onPageChange).toHaveBeenNthCalledWith(3, 3); // next (2+1)
        expect(defaultProps.onPageChange).toHaveBeenNthCalledWith(4, 5); // last page
    });

    it("disables all buttons when there is only one page", () => {
        render(<Pagination {...defaultProps} page={1} totalPages={1} />);

        expect(screen.getByRole("button", { name: "first_page" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "previous_page" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "next_page" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "last_page" })).toBeDisabled();
    });

    it("calls onPageSizeChange when page size is changed", async () => {
        const user = userEvent.setup();
        render(<Pagination {...defaultProps} />);

        const select = screen.getByTestId("page-size-select");
        await user.selectOptions(select, "20");

        expect(defaultProps.onPageSizeChange).toHaveBeenCalledWith(20);
    });
});
