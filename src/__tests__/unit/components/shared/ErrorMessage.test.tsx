import { render, screen } from "@testing-library/react";

import { ErrorMessage } from "@/components/shared/ErrorMessage";

describe("ErrorMessage", () => {
    it("renders the error message text", () => {
        render(<ErrorMessage message="Something went wrong" />);

        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
});
