import { render, screen } from "@testing-library/react";

import { CVPreview } from "@/components/features/cvs/CVPreview";

jest.mock("next-intl");

jest.mock("@/i18n/routing", () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("next/navigation", () => ({
    useParams: () => ({ id: "cv-123" }),
}));

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

jest.mock("sonner", () => ({
    toast: { error: jest.fn() },
}));

const mockCv = {
    id: "cv-123",
    created_at: "2024-01-01",
    name: "Full Stack Developer",
    education: "MIT Computer Science",
    description: "Experienced developer",
    user: {
        id: "u1",
        email: "john@test.com",
        position_name: "Senior Developer",
        profile: { full_name: "John Doe" },
    },
    projects: [
        {
            id: "p1",
            name: "E-commerce Platform",
            start_date: "2023-01-01",
            end_date: "2023-12-31",
            description: "Online store",
            domain: "E-commerce",
            responsibilities: ["Backend API", "Database design"],
            roles: ["Lead Developer", "Architect"],
            environment: ["React", "Node.js"],
            project: { id: "proj-1" },
        },
    ],
    skills: [
        { name: "React", mastery: "Expert" },
        { name: "TypeScript", mastery: "Skillful" },
    ],
    languages: [
        { name: "English", proficiency: "Native" },
        { name: "Polish", proficiency: "B2" },
    ],
};

let useCvReturn = {
    cv: mockCv as typeof mockCv | undefined,
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
};

jest.mock("@/lib/hooks/useCV", () => ({
    useCv: () => useCvReturn,
}));

jest.mock("@tanstack/react-query", () => ({
    useQuery: () => ({
        data: {
            skills: [
                { id: "s1", name: "React", category_name: "Frontend", category_parent_name: null },
                {
                    id: "s2",
                    name: "TypeScript",
                    category_name: "Languages",
                    category_parent_name: null,
                },
            ],
        },
    }),
}));

describe("CVPreview", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useCvReturn = {
            cv: mockCv,
            isLoading: false,
            isError: false,
            refetch: jest.fn(),
        };
    });

    it("renders user full name", () => {
        render(<CVPreview />);

        expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("renders user position", () => {
        render(<CVPreview />);

        expect(screen.getByText("Senior Developer")).toBeInTheDocument();
    });

    it("renders CV name and description", () => {
        render(<CVPreview />);

        expect(screen.getByText("Full Stack Developer")).toBeInTheDocument();
        expect(screen.getByText("Experienced developer")).toBeInTheDocument();
    });

    it("renders education", () => {
        render(<CVPreview />);

        expect(screen.getByText("MIT Computer Science")).toBeInTheDocument();
    });

    it("renders languages with proficiency", () => {
        render(<CVPreview />);

        expect(screen.getByText("English — Native")).toBeInTheDocument();
        expect(screen.getByText("Polish — B2")).toBeInTheDocument();
    });

    it("renders project details", () => {
        render(<CVPreview />);

        expect(screen.getByText("E-commerce Platform")).toBeInTheDocument();
        expect(screen.getByText("Online store")).toBeInTheDocument();
        expect(screen.getByText("Lead Developer, Architect")).toBeInTheDocument();
    });

    it("renders project responsibilities", () => {
        render(<CVPreview />);

        expect(screen.getByText("Backend API")).toBeInTheDocument();
        expect(screen.getByText("Database design")).toBeInTheDocument();
    });

    it("renders project period", () => {
        render(<CVPreview />);

        expect(screen.getByText("2023-01-01 – 2023-12-31")).toBeInTheDocument();
    });

    it("renders export PDF button", () => {
        render(<CVPreview />);

        expect(screen.getByText("export_pdf")).toBeInTheDocument();
    });

    it("renders domain from projects", () => {
        render(<CVPreview />);

        expect(screen.getByText("E-commerce")).toBeInTheDocument();
    });

    it("renders skill categories", () => {
        render(<CVPreview />);

        expect(screen.getAllByText("Frontend").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Languages").length).toBeGreaterThan(0);
    });

    it("shows loading skeleton when cv is undefined", () => {
        useCvReturn = {
            cv: undefined,
            isLoading: true,
            isError: false,
            refetch: jest.fn(),
        };

        render(<CVPreview />);

        expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
});
