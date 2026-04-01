import { render, screen } from "@testing-library/react";

import { EmployeeProfile } from "@/components/features/employees/user/EmployeeProfile";
import { useUserData } from "@/lib/hooks/useUserData";

jest.mock("next-intl");

jest.mock("next/navigation", () => ({
    useParams: jest.fn(() => ({ id: "emp-123" })),
}));

jest.mock("@/lib/hooks/useUserData", () => ({
    useUserData: jest.fn(),
}));

jest.mock("@/components/shared/EmployeeAvatar", () => ({
    EmployeeAvatar: ({ initial }: { initial: string }) => <div data-testid="avatar">{initial}</div>,
}));

jest.mock("@/components/shared/ErrorMessage", () => ({
    ErrorMessage: ({ message }: { message: string }) => <div data-testid="error">{message}</div>,
}));

const mockEmployee = {
    id: "emp-123",
    email: "john@test.com",
    created_at: "1700000000000",
    department_name: "Engineering",
    position_name: "Developer",
    profile: {
        first_name: "John",
        last_name: "Doe",
        avatar: null,
    },
};

describe("EmployeeProfile", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders loading skeleton while data is loading", () => {
        (useUserData as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
        });

        const { container } = render(<EmployeeProfile />);

        // Skeleton elements should be present (Skeleton renders divs with animate-pulse)
        expect(
            container.querySelector("[class*='animate-pulse'], [data-slot='skeleton']"),
        ).toBeTruthy();
    });

    it("renders error message when data fails to load", () => {
        (useUserData as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
        });

        render(<EmployeeProfile />);

        expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    it("renders error message when no data is returned", () => {
        (useUserData as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
        });

        render(<EmployeeProfile />);

        expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    it("renders employee profile data correctly", () => {
        (useUserData as jest.Mock).mockReturnValue({
            data: mockEmployee,
            isLoading: false,
            isError: false,
        });

        render(<EmployeeProfile />);

        expect(screen.getByText(/John/)).toBeInTheDocument();
        expect(screen.getByText(/Doe/)).toBeInTheDocument();
        expect(screen.getByText("john@test.com")).toBeInTheDocument();
    });

    it("renders avatar with first letter of first name", () => {
        (useUserData as jest.Mock).mockReturnValue({
            data: mockEmployee,
            isLoading: false,
            isError: false,
        });

        render(<EmployeeProfile />);

        expect(screen.getByTestId("avatar")).toHaveTextContent("J");
    });

    it("falls back to email initial when first name is missing", () => {
        (useUserData as jest.Mock).mockReturnValue({
            data: {
                ...mockEmployee,
                profile: { first_name: null, last_name: null, avatar: null },
            },
            isLoading: false,
            isError: false,
        });

        render(<EmployeeProfile />);

        expect(screen.getByTestId("avatar")).toHaveTextContent("J");
    });

    it("renders member since date", () => {
        (useUserData as jest.Mock).mockReturnValue({
            data: mockEmployee,
            isLoading: false,
            isError: false,
        });

        render(<EmployeeProfile />);

        expect(screen.getByText(/member_since/)).toBeInTheDocument();
    });

    it("passes the route param id to useUserData", () => {
        (useUserData as jest.Mock).mockReturnValue({
            data: mockEmployee,
            isLoading: false,
            isError: false,
        });

        render(<EmployeeProfile />);

        expect(useUserData).toHaveBeenCalledWith("emp-123");
    });
});
