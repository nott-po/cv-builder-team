import { formatDateForDisplay, parseDateForInput } from "@/lib/utils/date";

describe("formatDateForDisplay", () => {
    it("converts ISO date string to DD/MM/YYYY format", () => {
        expect(formatDateForDisplay("2024-01-15")).toBe("15/01/2024");
    });

    it("handles full ISO datetime strings", () => {
        expect(formatDateForDisplay("2024-01-15T10:30:00Z")).toBe("15/01/2024");
    });

    it("returns fallback for null input", () => {
        expect(formatDateForDisplay(null, "N/A")).toBe("N/A");
    });

    it("returns fallback for undefined input", () => {
        expect(formatDateForDisplay(undefined, "—")).toBe("—");
    });

    it("returns empty string fallback by default", () => {
        expect(formatDateForDisplay(null)).toBe("");
    });

    it("returns non-ISO strings as-is", () => {
        expect(formatDateForDisplay("15/01/2024")).toBe("15/01/2024");
    });

    it("returns empty string for empty input", () => {
        expect(formatDateForDisplay("")).toBe("");
    });
});

describe("parseDateForInput", () => {
    it("extracts YYYY-MM-DD from full ISO datetime", () => {
        expect(parseDateForInput("2024-01-15T10:30:00Z")).toBe("2024-01-15");
    });

    it("returns YYYY-MM-DD as-is", () => {
        expect(parseDateForInput("2024-01-15")).toBe("2024-01-15");
    });

    it("converts DD/MM/YYYY to YYYY-MM-DD", () => {
        expect(parseDateForInput("15/01/2024")).toBe("2024-01-15");
    });

    it("returns empty string for null input", () => {
        expect(parseDateForInput(null)).toBe("");
    });

    it("returns empty string for undefined input", () => {
        expect(parseDateForInput(undefined)).toBe("");
    });

    it("returns unrecognized formats as-is", () => {
        expect(parseDateForInput("Jan 15 2024")).toBe("Jan 15 2024");
    });
});
