import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getSignupFormSchema, SignupForm } from "@/components/features/auth/SignupForm";
import { useRouter } from "@/i18n/routing";
import apiClient from "@/lib/api/client";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

jest.mock("next-intl");

jest.mock("@/i18n/routing", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@/lib/hooks/useCurrentUser", () => ({
    useCurrentUser: jest.fn(),
}));

jest.mock("@/lib/api/client", () => ({
    __esModule: true,
    default: {
        post: jest.fn(),
    },
}));

jest.mock("@/lib/constants/roles", () => ({
    ROLE_HOME: {
        Admin: "/admin/employees",
        Employee: "/employees",
    },
}));

describe("getSignupFormSchema (Validation)", () => {
    const mockT = (key: string) => key;
    const schema = getSignupFormSchema(mockT);

    it("rejects password shorter than 8 characters", () => {
        const result = schema.safeParse({
            email: "test@test.com",
            password: "Ab1!",
            confirmPassword: "Ab1!",
        });
        expect(result.success).toBe(false);
    });

    it("rejects password without uppercase letter", () => {
        const result = schema.safeParse({
            email: "test@test.com",
            password: "password1!",
            confirmPassword: "password1!",
        });
        expect(result.success).toBe(false);
    });

    it("rejects password without lowercase letter", () => {
        const result = schema.safeParse({
            email: "test@test.com",
            password: "PASSWORD1!",
            confirmPassword: "PASSWORD1!",
        });
        expect(result.success).toBe(false);
    });

    it("rejects password without digit", () => {
        const result = schema.safeParse({
            email: "test@test.com",
            password: "Password!@",
            confirmPassword: "Password!@",
        });
        expect(result.success).toBe(false);
    });

    it("rejects password without special character", () => {
        const result = schema.safeParse({
            email: "test@test.com",
            password: "Password12",
            confirmPassword: "Password12",
        });
        expect(result.success).toBe(false);
    });

    it("rejects mismatched passwords", () => {
        const result = schema.safeParse({
            email: "test@test.com",
            password: "Password123!",
            confirmPassword: "DifferentPassword!",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toContain("confirmPassword");
            expect(result.error.issues[0].message).toBe("passwords_do_not_match");
        }
    });

    it("accepts valid strong password with matching confirm", () => {
        const result = schema.safeParse({
            email: "test@test.com",
            password: "Password123!",
            confirmPassword: "Password123!",
        });
        expect(result.success).toBe(true);
    });

    it("rejects invalid email", () => {
        const result = schema.safeParse({
            email: "not-an-email",
            password: "Password123!",
            confirmPassword: "Password123!",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("wrong_email");
        }
    });
});

describe("SignupForm Component (UI)", () => {
    const mockPush = jest.fn();
    const mockSetUser = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useCurrentUser as jest.Mock).mockReturnValue({ setUser: mockSetUser });
    });

    it("renders all fields and submit button", () => {
        render(<SignupForm />);

        expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("confirm_password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "sign_up" })).toBeInTheDocument();
    });

    it("shows validation errors when submitting empty form", async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        await user.click(screen.getByRole("button", { name: "sign_up" }));

        await waitFor(() => {
            expect(screen.getByText("wrong_email")).toBeInTheDocument();
        });

        expect(apiClient.post).not.toHaveBeenCalled();
    });

    it("shows error if passwords do not match", async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        await user.type(screen.getByPlaceholderText("email"), "test@test.com");
        await user.type(screen.getByPlaceholderText("password"), "StrongPass1!");
        await user.type(screen.getByPlaceholderText("confirm_password"), "DifferentPass1!");
        await user.click(screen.getByRole("button", { name: "sign_up" }));

        await waitFor(() => {
            expect(screen.getByText("passwords_do_not_match")).toBeInTheDocument();
        });

        expect(apiClient.post).not.toHaveBeenCalled();
    });

    it("successfully signs up Admin and redirects to /admin/employees", async () => {
        const user = userEvent.setup();

        const mockUser = { id: "1", role: "Admin", email: "test@test.com" };
        (apiClient.post as jest.Mock).mockResolvedValueOnce({
            data: { user: mockUser },
        });

        render(<SignupForm />);

        await user.type(screen.getByPlaceholderText("email"), "test@test.com");
        await user.type(screen.getByPlaceholderText("password"), "ValidPass123!");
        await user.type(screen.getByPlaceholderText("confirm_password"), "ValidPass123!");

        await user.click(screen.getByRole("button", { name: "sign_up" }));

        await waitFor(() => {
            expect(apiClient.post).toHaveBeenCalledWith("/auth/signup", {
                email: "test@test.com",
                password: "ValidPass123!",
            });
            expect(mockSetUser).toHaveBeenCalledWith(mockUser);
            expect(mockPush).toHaveBeenCalledWith("/admin/employees");
        });
    });

    it("does not send confirmPassword to the API", async () => {
        const user = userEvent.setup();

        (apiClient.post as jest.Mock).mockResolvedValueOnce({
            data: { user: { id: "1", role: "Employee", email: "test@test.com" } },
        });

        render(<SignupForm />);

        await user.type(screen.getByPlaceholderText("email"), "test@test.com");
        await user.type(screen.getByPlaceholderText("password"), "ValidPass123!");
        await user.type(screen.getByPlaceholderText("confirm_password"), "ValidPass123!");
        await user.click(screen.getByRole("button", { name: "sign_up" }));

        await waitFor(() => {
            const callArgs = (apiClient.post as jest.Mock).mock.calls[0][1];
            expect(callArgs).not.toHaveProperty("confirmPassword");
            expect(callArgs).toEqual({
                email: "test@test.com",
                password: "ValidPass123!",
            });
        });
    });

    it("shows server error on failed registration", async () => {
        const user = userEvent.setup();

        const mockAxiosError = {
            isAxiosError: true,
            response: { data: { error: "Email already exists" } },
        };
        (apiClient.post as jest.Mock).mockRejectedValueOnce(mockAxiosError);

        render(<SignupForm />);

        await user.type(screen.getByPlaceholderText("email"), "exist@test.com");
        await user.type(screen.getByPlaceholderText("password"), "ValidPass123!");
        await user.type(screen.getByPlaceholderText("confirm_password"), "ValidPass123!");

        await user.click(screen.getByRole("button", { name: "sign_up" }));

        await waitFor(() => {
            expect(screen.getByText("Email already exists")).toBeInTheDocument();
        });

        expect(mockPush).not.toHaveBeenCalled();
    });

    it("shows generic error when server returns non-axios error", async () => {
        const user = userEvent.setup();

        (apiClient.post as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

        render(<SignupForm />);

        await user.type(screen.getByPlaceholderText("email"), "test@test.com");
        await user.type(screen.getByPlaceholderText("password"), "ValidPass123!");
        await user.type(screen.getByPlaceholderText("confirm_password"), "ValidPass123!");

        await user.click(screen.getByRole("button", { name: "sign_up" }));

        await waitFor(() => {
            expect(screen.getByText("server_error")).toBeInTheDocument();
        });
    });

    it("disables submit button while submitting", async () => {
        const user = userEvent.setup();

        let resolvePost: (value: unknown) => void;
        (apiClient.post as jest.Mock).mockReturnValueOnce(
            new Promise((resolve) => {
                resolvePost = resolve;
            }),
        );

        render(<SignupForm />);

        await user.type(screen.getByPlaceholderText("email"), "test@test.com");
        await user.type(screen.getByPlaceholderText("password"), "ValidPass123!");
        await user.type(screen.getByPlaceholderText("confirm_password"), "ValidPass123!");

        await user.click(screen.getByRole("button", { name: "sign_up" }));

        await waitFor(() => {
            expect(screen.getByRole("button", { name: "loading" })).toBeDisabled();
        });

        resolvePost!({ data: { user: { id: "1", role: "Employee", email: "test@test.com" } } });

        await waitFor(() => {
            expect(screen.getByRole("button", { name: "sign_up" })).not.toBeDisabled();
        });
    });

    it("toggles password visibility on the password field", async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        const passwordInput = screen.getByPlaceholderText("password");

        expect(passwordInput).toHaveAttribute("type", "password");

        const allButtons = screen.getAllByRole("button");
        const togglePasswordButton = allButtons[0];

        await user.click(togglePasswordButton);
        expect(passwordInput).toHaveAttribute("type", "text");

        await user.click(togglePasswordButton);
        expect(passwordInput).toHaveAttribute("type", "password");
    });
});
