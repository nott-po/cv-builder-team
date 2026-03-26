import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RowActionsDropdown } from "@/components/shared/RowActionsDropdown";

jest.mock("next-intl");

describe("RowActionsDropdown", () => {
    it("renders trigger button with aria-label", () => {
        render(<RowActionsDropdown onEdit={jest.fn()} onDelete={jest.fn()} ariaLabel="Actions" />);

        expect(screen.getByRole("button", { name: "Actions" })).toBeInTheDocument();
    });

    it("shows edit and delete options when opened", async () => {
        const user = userEvent.setup();
        render(<RowActionsDropdown onEdit={jest.fn()} onDelete={jest.fn()} ariaLabel="Actions" />);

        await user.click(screen.getByRole("button", { name: "Actions" }));

        expect(screen.getByText("edit")).toBeInTheDocument();
        expect(screen.getByText("delete")).toBeInTheDocument();
    });

    it("calls onEdit when edit is clicked", async () => {
        const onEdit = jest.fn();
        const user = userEvent.setup();
        render(<RowActionsDropdown onEdit={onEdit} onDelete={jest.fn()} ariaLabel="Actions" />);

        await user.click(screen.getByRole("button", { name: "Actions" }));
        await user.click(screen.getByText("edit"));

        expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it("calls onDelete when delete is clicked", async () => {
        const onDelete = jest.fn();
        const user = userEvent.setup();
        render(<RowActionsDropdown onEdit={jest.fn()} onDelete={onDelete} ariaLabel="Actions" />);

        await user.click(screen.getByRole("button", { name: "Actions" }));
        await user.click(screen.getByText("delete"));

        expect(onDelete).toHaveBeenCalledTimes(1);
    });
});
