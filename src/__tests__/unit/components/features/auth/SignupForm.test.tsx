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
        ADMIN: "/admin-dashboard",
        USER: "/dashboard",
    },
}));

describe("getSignupFormSchema (Validation)", () => {
    const mockT = (key: string) => key;
    const schema = getSignupFormSchema(mockT);

    it("should return an error if passwords do not match", () => {
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

    it("should successfully validate with correct data", () => {
        const result = schema.safeParse({
            email: "test@test.com",
            password: "Password123!",
            confirmPassword: "Password123!",
        });
        expect(result.success).toBe(true);
    });

    it("should return an error for invalid email", () => {
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

    it("should return an error if password is less than 6 characters", () => {
        const result = schema.safeParse({
            email: "test@test.com",
            password: "123",
            confirmPassword: "123",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("wrong_password");
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
            expect(screen.getByText("wrong_password")).toBeInTheDocument();
        });

        expect(apiClient.post).not.toHaveBeenCalled();
    });

    it("shows error if passwords do not match on input", async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        await user.type(screen.getByPlaceholderText("email"), "test@test.com");
        await user.type(screen.getByPlaceholderText("password"), "Pass123!");
        await user.type(screen.getByPlaceholderText("confirm_password"), "Pass456!");
        await user.click(screen.getByRole("button", { name: "sign_up" }));

        await waitFor(() => {
            expect(screen.getByText("passwords_do_not_match")).toBeInTheDocument();
        });

        expect(apiClient.post).not.toHaveBeenCalled();
    });

    it("successfully submits data, updates user and redirects", async () => {
        const user = userEvent.setup();

        const mockUser = { id: "1", role: "ADMIN", email: "test@test.com" };
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
            expect(mockPush).toHaveBeenCalledWith("/admin-dashboard");
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

    it("should switch the password visibility when clicking on the 'eye' icon", async () => {
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
