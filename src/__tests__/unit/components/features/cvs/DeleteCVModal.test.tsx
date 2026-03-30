import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DeleteCVModal } from "@/components/features/cvs/DeleteCVModal";

jest.mock("next-intl");

const mockHandleMutate = jest.fn();
const mockHandleOpenChange = jest.fn();

jest.mock("@/lib/hooks/useModalMutation", () => ({
    useModalMutation: () => ({
        isPending: false,
        submitError: null,
        handleOpenChange: mockHandleOpenChange,
        handleMutate: mockHandleMutate,
    }),
}));

jest.mock("@tanstack/react-query", () => ({
    useQueryClient: () => ({
        invalidateQueries: jest.fn(),
    }),
}));

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

const mockCv = {
    id: "cv-1",
    created_at: "2024-01-01",
    name: "My CV",
    description: "A test CV",
};

describe("DeleteCVModal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders delete confirmation with cv name", () => {
        render(<DeleteCVModal open={true} cv={mockCv} onOpenChange={jest.fn()} />);

        expect(screen.getByText("delete_cv")).toBeInTheDocument();
        expect(screen.getByText("My CV")).toBeInTheDocument();
    });

    it("renders cancel and confirm buttons", () => {
        render(<DeleteCVModal open={true} cv={mockCv} onOpenChange={jest.fn()} />);

        expect(screen.getByRole("button", { name: "cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "confirm" })).toBeInTheDocument();
    });

    it("calls handleMutate when confirm is clicked", async () => {
        const user = userEvent.setup();
        render(<DeleteCVModal open={true} cv={mockCv} onOpenChange={jest.fn()} />);

        await user.click(screen.getByRole("button", { name: "confirm" }));

        expect(mockHandleMutate).toHaveBeenCalledWith("cv-1", "delete_cv_error");
    });

    it("does not render content when closed", () => {
        render(<DeleteCVModal open={false} cv={mockCv} onOpenChange={jest.fn()} />);

        expect(screen.queryByText("delete_cv")).not.toBeInTheDocument();
    });
});
