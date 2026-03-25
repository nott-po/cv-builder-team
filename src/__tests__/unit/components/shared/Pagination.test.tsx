import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Pagination } from "@/components/shared/Pagination";

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
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);

        await user.click(screen.getByRole("button", { name: "previous_page" }));
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(1); // 2 - 1 = 1

        await user.click(screen.getByRole("button", { name: "next_page" }));
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(3); // 2 + 1 = 3

        await user.click(screen.getByRole("button", { name: "last_page" }));
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(5);
    });

    it("disables all buttons when there is only one page", () => {
        render(<Pagination {...defaultProps} page={1} totalPages={1} />);

        expect(screen.getByRole("button", { name: "first_page" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "previous_page" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "next_page" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "last_page" })).toBeDisabled();
    });
});
