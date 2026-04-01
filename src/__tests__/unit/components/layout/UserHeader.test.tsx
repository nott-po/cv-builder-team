import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UserHeader } from "@/components/layout/user/UserHeader";

jest.mock("next-intl");

describe("UserHeader", () => {
    const mockOnModeChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders profile, skills and languages tabs", () => {
        render(<UserHeader mode="profile" onModeChange={mockOnModeChange} />);

        expect(screen.getByText("profile")).toBeInTheDocument();
        expect(screen.getByText("skills")).toBeInTheDocument();
        expect(screen.getByText("languages")).toBeInTheDocument();
    });

    it("calls onModeChange with 'skills' when skills tab is clicked", async () => {
        const user = userEvent.setup();
        render(<UserHeader mode="profile" onModeChange={mockOnModeChange} />);

        await user.click(screen.getByText("skills"));

        expect(mockOnModeChange).toHaveBeenCalledWith("skills");
    });

    it("calls onModeChange with 'language' when languages tab is clicked", async () => {
        const user = userEvent.setup();
        render(<UserHeader mode="profile" onModeChange={mockOnModeChange} />);

        await user.click(screen.getByText("languages"));

        expect(mockOnModeChange).toHaveBeenCalledWith("language");
    });

    it("calls onModeChange with 'profile' when profile tab is clicked", async () => {
        const user = userEvent.setup();
        render(<UserHeader mode="skills" onModeChange={mockOnModeChange} />);

        await user.click(screen.getByText("profile"));

        expect(mockOnModeChange).toHaveBeenCalledWith("profile");
    });
});
