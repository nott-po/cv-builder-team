import { render, screen } from "@testing-library/react";

import { EmployeeAvatar } from "@/components/shared/EmployeeAvatar";

jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: Record<string, unknown>) => <img {...props} />,
}));

describe("EmployeeAvatar", () => {
    it("renders initial when no avatar is provided", () => {
        render(<EmployeeAvatar initial="J" />);

        expect(screen.getByText("J")).toBeInTheDocument();
    });

    it("renders image when avatar URL is provided", () => {
        const { container } = render(
            <EmployeeAvatar initial="J" avatar="https://example.com/avatar.jpg" />,
        );

        const img = container.querySelector("img");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
    });

    it("does not render initial when avatar is provided", () => {
        render(<EmployeeAvatar initial="J" avatar="https://example.com/avatar.jpg" />);

        expect(screen.queryByText("J")).not.toBeInTheDocument();
    });
});
