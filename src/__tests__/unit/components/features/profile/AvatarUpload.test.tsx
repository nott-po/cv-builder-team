import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AvatarUpload } from "@/components/features/profile/AvatarUpload";

jest.mock("next-intl");

jest.mock("@/components/shared/EmployeeAvatar", () => ({
    EmployeeAvatar: ({ initial }: { initial: string }) => <div data-testid="avatar">{initial}</div>,
}));

jest.mock("@/components/ui/form", () => ({
    FormControl: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    FormItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    FormLabel: ({
        children,
        ...props
    }: React.LabelHTMLAttributes<HTMLLabelElement> & { children: React.ReactNode }) => (
        <label {...props}>{children}</label>
    ),
    FormMessage: () => null,
}));

const defaultProps = {
    currentAvatar: null as string | null,
    initial: "J",
    avatarFile: null as File | null,
    onChange: jest.fn(),
};

function createFile(name: string, size: number, type: string): File {
    const buffer = new ArrayBuffer(size);
    return new File([buffer], name, { type });
}

describe("AvatarUpload", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders avatar with initial", () => {
        render(<AvatarUpload {...defaultProps} />);

        expect(screen.getByTestId("avatar")).toHaveTextContent("J");
    });

    it("renders upload label and rules text", () => {
        render(<AvatarUpload {...defaultProps} />);

        expect(screen.getByText("upload_avatar")).toBeInTheDocument();
        expect(screen.getByText("upload_avatar_rules")).toBeInTheDocument();
    });

    it("renders hidden file input with correct accept attribute", () => {
        render(<AvatarUpload {...defaultProps} />);

        const input = document.getElementById("my-avatar-upload") as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input.type).toBe("file");
        expect(input.accept).toBe(".png,.jpg,.jpeg,.gif");
    });

    it("calls onChange when a valid file is selected", async () => {
        const onChange = jest.fn();
        render(<AvatarUpload {...defaultProps} onChange={onChange} />);

        const file = createFile("photo.png", 100 * 1024, "image/png");
        const input = document.getElementById("my-avatar-upload") as HTMLInputElement;

        await userEvent.upload(input, file);

        expect(onChange).toHaveBeenCalledWith(file);
    });

    it("does not call onChange for invalid file type (via drop)", () => {
        const onChange = jest.fn();
        render(<AvatarUpload {...defaultProps} onChange={onChange} />);

        const dropZone = screen.getByTestId("avatar").closest("div[class*='border-dashed']")!;
        const file = createFile("doc.pdf", 100 * 1024, "application/pdf");

        fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByText("avatar_invalid_format")).toBeInTheDocument();
    });

    it("does not call onChange for file exceeding 500KB", async () => {
        const onChange = jest.fn();
        render(<AvatarUpload {...defaultProps} onChange={onChange} />);

        const file = createFile("big.png", 600 * 1024, "image/png");
        const input = document.getElementById("my-avatar-upload") as HTMLInputElement;

        await userEvent.upload(input, file);

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByText("avatar_file_too_large")).toBeInTheDocument();
    });

    it("accepts valid jpeg file", async () => {
        const onChange = jest.fn();
        render(<AvatarUpload {...defaultProps} onChange={onChange} />);

        const file = createFile("photo.jpg", 200 * 1024, "image/jpeg");
        const input = document.getElementById("my-avatar-upload") as HTMLInputElement;

        await userEvent.upload(input, file);

        expect(onChange).toHaveBeenCalledWith(file);
    });

    it("accepts valid gif file", async () => {
        const onChange = jest.fn();
        render(<AvatarUpload {...defaultProps} onChange={onChange} />);

        const file = createFile("anim.gif", 100 * 1024, "image/gif");
        const input = document.getElementById("my-avatar-upload") as HTMLInputElement;

        await userEvent.upload(input, file);

        expect(onChange).toHaveBeenCalledWith(file);
    });

    it("rejects webp files (via drop)", () => {
        const onChange = jest.fn();
        render(<AvatarUpload {...defaultProps} onChange={onChange} />);

        const dropZone = screen.getByTestId("avatar").closest("div[class*='border-dashed']")!;
        const file = createFile("photo.webp", 100 * 1024, "image/webp");

        fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByText("avatar_invalid_format")).toBeInTheDocument();
    });

    it("does not show delete button when no avatar exists", () => {
        render(<AvatarUpload {...defaultProps} onDeleteRequest={jest.fn()} />);

        expect(screen.queryByLabelText("delete_avatar_title")).not.toBeInTheDocument();
    });

    it("shows delete button when currentAvatar exists", () => {
        render(
            <AvatarUpload
                {...defaultProps}
                currentAvatar="https://example.com/avatar.png"
                onDeleteRequest={jest.fn()}
            />,
        );

        expect(screen.getByLabelText("delete_avatar_title")).toBeInTheDocument();
    });

    it("calls onDeleteRequest when delete button is clicked", async () => {
        const onDeleteRequest = jest.fn();
        const user = userEvent.setup();

        render(
            <AvatarUpload
                {...defaultProps}
                currentAvatar="https://example.com/avatar.png"
                onDeleteRequest={onDeleteRequest}
            />,
        );

        await user.click(screen.getByLabelText("delete_avatar_title"));

        expect(onDeleteRequest).toHaveBeenCalled();
    });

    it("does not show delete button when onDeleteRequest is not provided", () => {
        render(<AvatarUpload {...defaultProps} currentAvatar="https://example.com/avatar.png" />);

        expect(screen.queryByLabelText("delete_avatar_title")).not.toBeInTheDocument();
    });

    it("handles drag and drop with valid file", () => {
        const onChange = jest.fn();
        render(<AvatarUpload {...defaultProps} onChange={onChange} />);

        const dropZone = screen.getByTestId("avatar").closest("div[class*='border-dashed']")!;
        const file = createFile("photo.png", 100 * 1024, "image/png");

        fireEvent.dragOver(dropZone);
        fireEvent.drop(dropZone, {
            dataTransfer: { files: [file] },
        });

        expect(onChange).toHaveBeenCalledWith(file);
    });
});
