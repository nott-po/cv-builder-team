import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SettingsForm } from "@/components/features/settings/SettingsForm";

const mockSetTheme = jest.fn();
const mockReplace = jest.fn();

jest.mock("next-intl", () => ({
    useTranslations: () => (key: string) => key,
    useLocale: () => "en",
}));

jest.mock("next-themes", () => ({
    useTheme: () => ({
        theme: "system",
        setTheme: mockSetTheme,
    }),
}));

jest.mock("@/i18n/routing", () => ({
    routing: { locales: ["en", "pl"] },
    LOCALE_LABELS: { en: "English", pl: "Polski" },
    useRouter: () => ({ replace: mockReplace }),
    usePathname: () => "/settings",
}));

jest.mock("@/components/ui/select", () => ({
    Select: ({
        value,
        onValueChange,
        children,
    }: {
        value?: string;
        onValueChange?: (v: string) => void;
        children: React.ReactNode;
    }) => (
        <select
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            data-testid="select"
        >
            {children}
        </select>
    ),
    SelectTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SelectValue: () => null,
    SelectContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SelectItem: ({ value, children }: { value: string; children: React.ReactNode }) => (
        <option value={value}>{children}</option>
    ),
}));

describe("SettingsForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders appearance and language labels", () => {
        render(<SettingsForm />);

        expect(screen.getByText("appearance")).toBeInTheDocument();
        expect(screen.getByText("language")).toBeInTheDocument();
    });

    it("renders theme options", () => {
        render(<SettingsForm />);

        expect(screen.getByText("theme_system")).toBeInTheDocument();
        expect(screen.getByText("theme_light")).toBeInTheDocument();
        expect(screen.getByText("theme_dark")).toBeInTheDocument();
    });

    it("renders locale options", () => {
        render(<SettingsForm />);

        expect(screen.getByText("English")).toBeInTheDocument();
        expect(screen.getByText("Polski")).toBeInTheDocument();
    });

    it("calls setTheme when theme select is changed", async () => {
        const user = userEvent.setup();
        render(<SettingsForm />);

        const selects = screen.getAllByTestId("select");
        await user.selectOptions(selects[0], "dark");

        expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });

    it("calls router.replace when locale select is changed", async () => {
        const user = userEvent.setup();
        render(<SettingsForm />);

        const selects = screen.getAllByTestId("select");
        await user.selectOptions(selects[1], "pl");

        expect(mockReplace).toHaveBeenCalledWith("/settings", { locale: "pl" });
    });
});
