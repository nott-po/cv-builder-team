import { render, screen } from "@testing-library/react";

import { ProfileForm } from "@/components/features/profile/ProfileForm";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useDepartments } from "@/lib/hooks/useDepartments";
import { usePositions } from "@/lib/hooks/usePositions";
import { useUserData } from "@/lib/hooks/useUserData";

jest.mock("next-intl");

jest.mock("@/i18n/routing", () => ({
    useRouter: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useSearchParams: jest.fn(() => ({ get: jest.fn(), toString: () => "" })),
}));

jest.mock("@tanstack/react-query", () => ({
    useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        mutateAsync: jest.fn(),
        isPending: false,
    })),
    useQueryClient: jest.fn(() => ({
        invalidateQueries: jest.fn(),
    })),
}));

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

jest.mock("@/lib/hooks/useCurrentUser", () => ({
    useCurrentUser: jest.fn(),
    CURRENT_USER_KEY: ["currentUser"],
}));

jest.mock("@/lib/hooks/useDepartments", () => ({
    useDepartments: jest.fn(),
}));

jest.mock("@/lib/hooks/usePositions", () => ({
    usePositions: jest.fn(),
}));

jest.mock("@/lib/hooks/useUserData", () => ({
    useUserData: jest.fn(),
}));

jest.mock("@/components/features/profile/AvatarUpload", () => ({
    AvatarUpload: ({ initial }: { initial: string }) => (
        <div data-testid="avatar-upload">{initial}</div>
    ),
    compressAvatar: jest.fn(),
}));

jest.mock("@/components/shared/ErrorMessage", () => ({
    ErrorMessage: ({ message }: { message: string }) => <div data-testid="error">{message}</div>,
}));

jest.mock("@/components/shared/DeleteConfirmModal", () => ({
    DeleteConfirmModal: ({ open }: { open: boolean }) =>
        open ? <div data-testid="delete-avatar-modal">Delete Avatar</div> : null,
}));

const mockUserData = {
    id: "user-1",
    email: "john@test.com",
    created_at: "1700000000000",
    department_name: "Engineering",
    department: { id: "dept-1" },
    position_name: "Developer",
    position: { id: "pos-1" },
    profile: {
        first_name: "John",
        last_name: "Doe",
        avatar: null,
    },
};

describe("ProfileForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useCurrentUser as jest.Mock).mockReturnValue({
            user: { id: "user-1", email: "john@test.com", role: "Employee" },
        });
        (useDepartments as jest.Mock).mockReturnValue({
            data: [{ id: "dept-1", name: "Engineering" }],
            isLoading: false,
        });
        (usePositions as jest.Mock).mockReturnValue({
            data: [{ id: "pos-1", name: "Developer" }],
            isLoading: false,
        });
        (useUserData as jest.Mock).mockReturnValue({
            data: mockUserData,
            isLoading: false,
            isError: false,
        });
    });

    it("renders profile data (name, email, member since)", () => {
        render(<ProfileForm />);

        expect(screen.getByText(/John/)).toBeInTheDocument();
        expect(screen.getByText(/Doe/)).toBeInTheDocument();
        expect(screen.getByText("john@test.com")).toBeInTheDocument();
        expect(screen.getByText(/member_since/)).toBeInTheDocument();
    });

    it("renders avatar upload component with correct initial", () => {
        render(<ProfileForm />);

        expect(screen.getByTestId("avatar-upload")).toHaveTextContent("J");
    });

    it("renders first name and last name input fields", () => {
        render(<ProfileForm />);

        const inputs = screen.getAllByRole("textbox");
        expect(inputs.length).toBeGreaterThanOrEqual(2);
    });

    it("renders update button", () => {
        render(<ProfileForm />);

        expect(screen.getByText("update")).toBeInTheDocument();
    });

    it("renders loading skeleton when data is loading", () => {
        (useUserData as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
        });

        const { container } = render(<ProfileForm />);

        expect(container.querySelector(".animate-pulse")).toBeTruthy();
    });

    it("renders error message when data fails to load", () => {
        (useUserData as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
        });

        render(<ProfileForm />);

        expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    it("renders error message when no data is returned", () => {
        (useUserData as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
        });

        render(<ProfileForm />);

        expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    it("falls back to email initial when first name is missing", () => {
        (useUserData as jest.Mock).mockReturnValue({
            data: {
                ...mockUserData,
                profile: { first_name: null, last_name: null, avatar: null },
            },
            isLoading: false,
            isError: false,
        });

        render(<ProfileForm />);

        expect(screen.getByTestId("avatar-upload")).toHaveTextContent("J");
    });

    it("falls back to ? when both name and email are missing", () => {
        (useUserData as jest.Mock).mockReturnValue({
            data: {
                ...mockUserData,
                email: undefined,
                profile: { first_name: null, last_name: null, avatar: null },
            },
            isLoading: false,
            isError: false,
        });

        render(<ProfileForm />);

        expect(screen.getByTestId("avatar-upload")).toHaveTextContent("?");
    });
});
