import { formatDate } from "@/lib/utils/date";

describe("Date Utils", () => {
    it("returns an empty string when formatDate is called", () => {
        expect(formatDate()).toBe("");
    });
});
