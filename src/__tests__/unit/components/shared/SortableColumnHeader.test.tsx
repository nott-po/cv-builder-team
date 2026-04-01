import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SortableColumnHeader } from "@/components/shared/SortableColumnHeader";

const renderInTable = (ui: React.ReactElement) =>
    render(
        <table>
            <thead>
                <tr>{ui}</tr>
            </thead>
        </table>,
    );

describe("SortableColumnHeader", () => {
    it("renders the label", () => {
        renderInTable(
            <SortableColumnHeader label="Department" sortDir="asc" onToggle={jest.fn()} />,
        );

        expect(screen.getByText("Department")).toBeInTheDocument();
    });

    it("calls onToggle when clicked", async () => {
        const onToggle = jest.fn();
        const user = userEvent.setup();
        renderInTable(
            <SortableColumnHeader label="Department" sortDir="asc" onToggle={onToggle} />,
        );

        await user.click(screen.getByRole("button"));

        expect(onToggle).toHaveBeenCalledTimes(1);
    });
});
