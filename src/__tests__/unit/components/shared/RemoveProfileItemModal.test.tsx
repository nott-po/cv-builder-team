import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RemoveProfileItemModal } from "@/components/shared/RemoveProfileItemModal";

jest.mock("next-intl");

const mockMutateAsync = jest.fn();
const mockInvalidateQueries = jest.fn();

jest.mock("@tanstack/react-query", () => ({
    useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
    useMutation: ({ mutationFn }: { mutationFn: (v: unknown) => Promise<unknown> }) => ({
        mutateAsync: (v: unknown) => {
            mockMutateAsync(v);
            return mutationFn(v);
        },
        isPending: false,
    }),
}));

describe("RemoveProfileItemModal", () => {
    const defaultProps = {
        open: true,
        onOpenChange: jest.fn(),
        title: "Remove skill",
        confirmText: "Are you sure you want to remove",
        itemName: "React",
        errorMessage: "Failed to remove",
        mutationFn: jest.fn().mockResolvedValue({}),
        queryKey: ["profile", "skills"],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders title and item name", () => {
        render(<RemoveProfileItemModal {...defaultProps} />);

        expect(screen.getByText("Remove skill")).toBeInTheDocument();
        expect(screen.getByText("React")).toBeInTheDocument();
    });

    it("renders confirm text", () => {
        render(<RemoveProfileItemModal {...defaultProps} />);

        expect(screen.getByText(/Are you sure you want to remove/)).toBeInTheDocument();
    });

    it("calls mutationFn with itemName on confirm", async () => {
        const user = userEvent.setup();
        render(<RemoveProfileItemModal {...defaultProps} />);

        await user.click(screen.getByRole("button", { name: "confirm" }));

        expect(defaultProps.mutationFn).toHaveBeenCalledWith("React");
    });
});
