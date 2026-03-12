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
        ADMIN: "/admin-dashboard",
        USER: "/dashboard",
    },
}));

describe("getLoginFormSchema (Login Validation)", () => {
    const mockT = (key: string) => key;
    const schema = getLoginFormSchema(mockT);

    it("should return an error for invalid email", () => {
        const result = schema.safeParse({
            email: "not-an-email",
            password: "Password123!",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("wrong_email");
        }
    });

    it("should return an error if password is less than 6 characters", () => {
        const result = schema.safeParse({
            email: "test@test.com",
            password: "123",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("wrong_password");
        }
    });

    it("should successfully validate with correct data", () => {
        const result = schema.safeParse({
            email: "test@test.com",
            password: "ValidPassword123!",
        });
        expect(result.success).toBe(true);
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

    it("1. renders email input, password input and login button", () => {
        render(<LoginForm />);

        expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "log_in" })).toBeInTheDocument();
    });

    it("2. shows validation errors when submitting empty form", async () => {
        const user = userEvent.setup();
        render(<LoginForm />);

        await user.click(screen.getByRole("button", { name: "log_in" }));

        await waitFor(() => {
            expect(screen.getByText("wrong_email")).toBeInTheDocument();
            expect(screen.getByText("wrong_password")).toBeInTheDocument();
        });

        expect(apiClient.post).not.toHaveBeenCalled();
    });

    it("3. successfully submits data, updates user and redirects", async () => {
        const user = userEvent.setup();

        const mockUser = { id: "1", role: "USER", email: "user@test.com" };
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
            expect(mockPush).toHaveBeenCalledWith("/dashboard");
        });
    });

    it("4. shows server error (e.g., invalid password)", async () => {
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
});
