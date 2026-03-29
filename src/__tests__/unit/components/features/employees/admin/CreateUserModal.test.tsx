import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CreateUserModal } from "@/components/features/employees/admin/CreateUserModal";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

jest.mock("next-intl");

jest.mock("@/i18n/routing", () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("next/navigation", () => ({
    useSearchParams: () => new URLSearchParams(),
}));

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

jest.mock("@tanstack/react-query", () => ({
    useQueryClient: () => ({ invalidateQueries: jest.fn() }),
    useQuery: () => ({ data: { departments: [], positions: [] } }),
}));

jest.mock("@/lib/hooks/useModalMutation", () => ({
    useModalMutation: jest.fn(),
}));

jest.mock("@/components/features/employees/admin/EmployeeForm", () => ({
    EmployeeForm: ({
        onCancel,
        onSubmit,
    }: {
        onCancel: () => void;
        onSubmit: (data: Record<string, string>) => void;
    }) => (
        <div data-testid="employee-form">
            <button onClick={onCancel}>Cancel</button>
            <button onClick={() => onSubmit({ email: "t@t.com", password: "Pass1!" })}>
                Submit
            </button>
        </div>
    ),
}));

describe("CreateUserModal", () => {
    const mockHandleMutate = jest.fn();
    const mockHandleOpenChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useModalMutation as jest.Mock).mockReturnValue({
            isPending: false,
            submitError: null,
            handleOpenChange: mockHandleOpenChange,
            handleMutate: mockHandleMutate,
        });
    });

    it("renders dialog title when open", () => {
        render(<CreateUserModal open={true} onOpenChange={jest.fn()} />);

        expect(screen.getByText("create_user_title")).toBeInTheDocument();
    });

    it("renders EmployeeForm inside the dialog", () => {
        render(<CreateUserModal open={true} onOpenChange={jest.fn()} />);

        expect(screen.getByTestId("employee-form")).toBeInTheDocument();
    });

    it("does not render content when closed", () => {
        render(<CreateUserModal open={false} onOpenChange={jest.fn()} />);

        expect(screen.queryByText("create_user_title")).not.toBeInTheDocument();
    });

    it("calls handleOpenChange(false) on cancel", async () => {
        const user = userEvent.setup();
        render(<CreateUserModal open={true} onOpenChange={jest.fn()} />);

        await user.click(screen.getByText("Cancel"));

        expect(mockHandleOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls handleMutate with structured payload on form submit", async () => {
        const user = userEvent.setup();
        render(<CreateUserModal open={true} onOpenChange={jest.fn()} />);

        await user.click(screen.getByText("Submit"));

        expect(mockHandleMutate).toHaveBeenCalledWith(
            expect.objectContaining({
                auth: { email: "t@t.com", password: "Pass1!" },
            }),
            expect.any(Function),
        );
    });
});
