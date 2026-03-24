import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getLoginFormSchema, LoginForm } from "@/components/features/auth/LoginForm";
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

describe("getLoginFormSchema (Login Validation)", () => {
    const mockT = (key: string) => key;
    const schema = getLoginFormSchema(mockT);

    it("rejects invalid email", () => {
        const result = schema.safeParse({
            email: "not-an-email",
            password: "Password123!",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("wrong_email");
        }
    });

    it("rejects password shorter than 6 characters", () => {
        const result = schema.safeParse({
            email: "test@test.com",
            password: "123",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("wrong_password");
        }
    });

    it("accepts valid email and password", () => {
        const result = schema.safeParse({
            email: "test@test.com",
            password: "ValidPassword123!",
        });
        expect(result.success).toBe(true);
    });

    it("rejects empty email", () => {
        const result = schema.safeParse({
            email: "",
            password: "ValidPassword123!",
        });
        expect(result.success).toBe(false);
    });
});

describe("LoginForm Component (UI)", () => {
    const mockPush = jest.fn();
    const mockSetUser = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useCurrentUser as jest.Mock).mockReturnValue({ setUser: mockSetUser });
    });

    it("renders email input, password input and login button", () => {
        render(<LoginForm />);

        expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "log_in" })).toBeInTheDocument();
    });

    it("shows validation errors when submitting empty form", async () => {
        const user = userEvent.setup();
        render(<LoginForm />);

        await user.click(screen.getByRole("button", { name: "log_in" }));

        await waitFor(() => {
            expect(screen.getByText("wrong_email")).toBeInTheDocument();
            expect(screen.getByText("wrong_password")).toBeInTheDocument();
        });

        expect(apiClient.post).not.toHaveBeenCalled();
    });

    it("successfully logs in Employee and redirects to /employees", async () => {
        const user = userEvent.setup();

        const mockUser = { id: "1", role: "Employee", email: "user@test.com" };
        (apiClient.post as jest.Mock).mockResolvedValueOnce({
            data: { user: mockUser },
        });

        render(<LoginForm />);

        await user.type(screen.getByPlaceholderText("email"), "user@test.com");
        await user.type(screen.getByPlaceholderText("password"), "ValidPass123!");

        await user.click(screen.getByRole("button", { name: "log_in" }));

        await waitFor(() => {
            expect(apiClient.post).toHaveBeenCalledWith("/auth/login", {
                email: "user@test.com",
                password: "ValidPass123!",
            });
            expect(mockSetUser).toHaveBeenCalledWith(mockUser);
            expect(mockPush).toHaveBeenCalledWith("/employees");
        });
    });

    it("successfully logs in Admin and redirects to /admin/employees", async () => {
        const user = userEvent.setup();

        const mockUser = { id: "1", role: "Admin", email: "admin@test.com" };
        (apiClient.post as jest.Mock).mockResolvedValueOnce({
            data: { user: mockUser },
        });

        render(<LoginForm />);

        await user.type(screen.getByPlaceholderText("email"), "admin@test.com");
        await user.type(screen.getByPlaceholderText("password"), "ValidPass123!");

        await user.click(screen.getByRole("button", { name: "log_in" }));

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith("/admin/employees");
        });
    });

    it("shows server error message on failed login", async () => {
        const user = userEvent.setup();

        const mockAxiosError = {
            isAxiosError: true,
            response: { data: { error: "Invalid credentials" } },
        };
        (apiClient.post as jest.Mock).mockRejectedValueOnce(mockAxiosError);

        render(<LoginForm />);

        await user.type(screen.getByPlaceholderText("email"), "test@test.com");
        await user.type(screen.getByPlaceholderText("password"), "WrongPass!");

        await user.click(screen.getByRole("button", { name: "log_in" }));

        await waitFor(() => {
            expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
        });

        expect(mockPush).not.toHaveBeenCalled();
    });

    it("shows generic error when server returns non-axios error", async () => {
        const user = userEvent.setup();

        (apiClient.post as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

        render(<LoginForm />);

        await user.type(screen.getByPlaceholderText("email"), "test@test.com");
        await user.type(screen.getByPlaceholderText("password"), "ValidPass!");

        await user.click(screen.getByRole("button", { name: "log_in" }));

        await waitFor(() => {
            expect(screen.getByText("server_error")).toBeInTheDocument();
        });
    });

    it("toggles password visibility", async () => {
        const user = userEvent.setup();
        render(<LoginForm />);

        const passwordInput = screen.getByPlaceholderText("password");

        expect(passwordInput).toHaveAttribute("type", "password");

        const allButtons = screen.getAllByRole("button");
        const togglePasswordButton = allButtons[0];

        await user.click(togglePasswordButton);
        expect(passwordInput).toHaveAttribute("type", "text");

        await user.click(togglePasswordButton);
        expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("disables submit button while submitting", async () => {
        const user = userEvent.setup();

        let resolvePost: (value: unknown) => void;
        (apiClient.post as jest.Mock).mockReturnValueOnce(
            new Promise((resolve) => {
                resolvePost = resolve;
            }),
        );

        render(<LoginForm />);

        await user.type(screen.getByPlaceholderText("email"), "test@test.com");
        await user.type(screen.getByPlaceholderText("password"), "ValidPass!");

        await user.click(screen.getByRole("button", { name: "log_in" }));

        await waitFor(() => {
            expect(screen.getByRole("button", { name: "loading" })).toBeDisabled();
        });

        resolvePost!({ data: { user: { id: "1", role: "Employee", email: "test@test.com" } } });

        await waitFor(() => {
            expect(screen.getByRole("button", { name: "log_in" })).not.toBeDisabled();
        });
    });
});
