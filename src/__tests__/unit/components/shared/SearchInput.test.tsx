import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchInput } from "@/components/shared/SearchInput";

describe("SearchInput", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("renders with placeholder", () => {
        render(<SearchInput value="" onChange={jest.fn()} placeholder="Search..." />);

        expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    it("displays the current value", () => {
        render(<SearchInput value="hello" onChange={jest.fn()} />);

        expect(screen.getByRole("textbox")).toHaveValue("hello");
    });

    it("debounces onChange calls", async () => {
        const onChange = jest.fn();
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        render(<SearchInput value="" onChange={onChange} debounceMs={300} />);

        await user.type(screen.getByRole("textbox"), "abc");

        // Should not have called onChange yet
        expect(onChange).not.toHaveBeenCalledWith("abc");

        // Advance past debounce
        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(onChange).toHaveBeenCalledWith("abc");
    });

    it("clears previous timer on new input", async () => {
        const onChange = jest.fn();
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        render(<SearchInput value="" onChange={onChange} debounceMs={300} />);

        await user.type(screen.getByRole("textbox"), "a");

        act(() => {
            jest.advanceTimersByTime(200);
        });

        await user.type(screen.getByRole("textbox"), "b");

        act(() => {
            jest.advanceTimersByTime(300);
        });

        // Should only have the final value, not intermediate
        expect(onChange).toHaveBeenLastCalledWith("ab");
    });
});
