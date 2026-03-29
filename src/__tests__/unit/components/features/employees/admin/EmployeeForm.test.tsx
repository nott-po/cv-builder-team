import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EmployeeForm } from "@/components/features/employees/admin/EmployeeForm";
import { UserRole } from "@/lib/constants/roles";

jest.mock("next-intl");

const departments = [
    { id: "dept-1", name: "Engineering" },
    { id: "dept-2", name: "HR" },
];

const positions = [
    { id: "pos-1", name: "Developer" },
    { id: "pos-2", name: "Manager" },
];

const defaultProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    departments,
    positions,
    isSubmitting: false,
    error: null,
};

describe("EmployeeForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("create mode", () => {
        it("renders email and password fields in create mode", () => {
            render(<EmployeeForm {...defaultProps} />);

            expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
            expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
        });

        it("calls onCancel when cancel button is clicked", async () => {
            const user = userEvent.setup();
            render(<EmployeeForm {...defaultProps} />);

            await user.click(screen.getByRole("button", { name: "cancel" }));

            expect(defaultProps.onCancel).toHaveBeenCalled();
        });

        it("validates email format on submit", async () => {
            const user = userEvent.setup();
            const onSubmit = jest.fn();
            render(<EmployeeForm {...defaultProps} onSubmit={onSubmit} />);

            await user.type(screen.getByPlaceholderText("email"), "not-an-email");
            await user.type(screen.getByPlaceholderText("password"), "password123");
            await user.click(screen.getByRole("button", { name: "create" }));

            await waitFor(() => {
                expect(onSubmit).not.toHaveBeenCalled();
            });
        });

        it("validates minimum password length on submit", async () => {
            const user = userEvent.setup();
            const onSubmit = jest.fn();
            render(<EmployeeForm {...defaultProps} onSubmit={onSubmit} />);

            await user.type(screen.getByPlaceholderText("email"), "test@test.com");
            await user.type(screen.getByPlaceholderText("password"), "12345");
            await user.click(screen.getByRole("button", { name: "create" }));

            await waitFor(() => {
                expect(onSubmit).not.toHaveBeenCalled();
            });
        });

        it("submits form with valid data", async () => {
            const user = userEvent.setup();
            const onSubmit = jest.fn().mockResolvedValue(undefined);
            render(<EmployeeForm {...defaultProps} onSubmit={onSubmit} />);

            await user.type(screen.getByPlaceholderText("email"), "test@test.com");
            await user.type(screen.getByPlaceholderText("password"), "password123");
            await user.type(screen.getByPlaceholderText("first_name"), "John");
            await user.type(screen.getByPlaceholderText("last_name"), "Doe");
            await user.click(screen.getByRole("button", { name: "create" }));

            await waitFor(() => {
                expect(onSubmit).toHaveBeenCalledWith(
                    expect.objectContaining({
                        email: "test@test.com",
                        password: "password123",
                        first_name: "John",
                        last_name: "Doe",
                        role: "Employee",
                    }),
                    expect.anything(),
                );
            });
        });

        it("defaults role to Employee", async () => {
            const user = userEvent.setup();
            const onSubmit = jest.fn().mockResolvedValue(undefined);
            render(<EmployeeForm {...defaultProps} onSubmit={onSubmit} />);

            await user.type(screen.getByPlaceholderText("email"), "test@test.com");
            await user.type(screen.getByPlaceholderText("password"), "password123");
            await user.click(screen.getByRole("button", { name: "create" }));

            await waitFor(() => {
                expect(onSubmit).toHaveBeenCalledWith(
                    expect.objectContaining({ role: "Employee" }),
                    expect.anything(),
                );
            });
        });
    });

    describe("edit mode", () => {
        const editProps = {
            ...defaultProps,
            mode: "edit" as const,
            initialData: {
                first_name: "Jane",
                last_name: "Smith",
                departmentId: "dept-1",
                positionId: "pos-1",
                role: UserRole.Admin,
            },
        };

        it("does not render email and password fields in edit mode", () => {
            render(<EmployeeForm {...editProps} />);

            expect(screen.queryByPlaceholderText("email")).not.toBeInTheDocument();
            expect(screen.queryByPlaceholderText("password")).not.toBeInTheDocument();
        });

        it("renders save button instead of create", () => {
            render(<EmployeeForm {...editProps} />);

            expect(screen.getByRole("button", { name: "save" })).toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "create" })).not.toBeInTheDocument();
        });

        it("pre-fills name fields with initial data", () => {
            render(<EmployeeForm {...editProps} />);

            expect(screen.getByPlaceholderText("first_name")).toHaveValue("Jane");
            expect(screen.getByPlaceholderText("last_name")).toHaveValue("Smith");
        });
    });

    describe("error and disabled states", () => {
        it("displays error message when error prop is set", () => {
            render(<EmployeeForm {...defaultProps} error="Something went wrong" />);

            expect(screen.getByText("Something went wrong")).toBeInTheDocument();
        });

        it("disables inputs when isSubmitting is true", () => {
            render(<EmployeeForm {...defaultProps} isSubmitting={true} />);

            expect(screen.getByPlaceholderText("email")).toBeDisabled();
            expect(screen.getByPlaceholderText("password")).toBeDisabled();
            expect(screen.getByPlaceholderText("first_name")).toBeDisabled();
            expect(screen.getByPlaceholderText("last_name")).toBeDisabled();
        });

        it("disables buttons when isSubmitting is true", () => {
            render(<EmployeeForm {...defaultProps} isSubmitting={true} />);

            expect(screen.getByRole("button", { name: "create" })).toBeDisabled();
            expect(screen.getByRole("button", { name: "cancel" })).toBeDisabled();
        });
    });
});
