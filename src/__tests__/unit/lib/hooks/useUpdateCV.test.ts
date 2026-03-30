import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";

import { useUpdateCV, type UpdateCvInputData } from "@/lib/hooks/useUpdateCV";

jest.mock("@/lib/graphql/fetcher", () => ({
    gqlClient: { request: jest.fn() },
}));

jest.mock("@tanstack/react-query", () => ({
    useMutation: jest.fn(),
    useQueryClient: jest.fn(),
}));

describe("useUpdateCV", () => {
    const mockMutateAsync = jest.fn();
    const mockInvalidateQueries = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useQueryClient as jest.Mock).mockReturnValue({
            invalidateQueries: mockInvalidateQueries,
        });
        (useMutation as jest.Mock).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
            error: null,
        });
    });

    it("returns mutation result from useMutation", () => {
        const { result } = renderHook(() => useUpdateCV());

        expect(result.current.mutateAsync).toBe(mockMutateAsync);
        expect(result.current.isPending).toBe(false);
    });

    it("configures useMutation with a mutationFn", () => {
        renderHook(() => useUpdateCV());

        expect(useMutation).toHaveBeenCalledWith(
            expect.objectContaining({
                mutationFn: expect.any(Function),
                onSuccess: expect.any(Function),
            }),
        );
    });

    it("calls gqlClient.request with correct arguments in mutationFn", async () => {
        const { gqlClient } = jest.requireMock("@/lib/graphql/fetcher");
        gqlClient.request.mockResolvedValue({ updateCv: { id: "cv-1" } });

        renderHook(() => useUpdateCV());

        const { mutationFn } = (useMutation as jest.Mock).mock.calls[0][0];

        const input: UpdateCvInputData = {
            cvId: "cv-1",
            name: "Updated CV",
            education: "MIT",
            description: "Updated description",
        };

        await mutationFn(input);

        expect(gqlClient.request).toHaveBeenCalledWith(expect.any(String), { cv: input });
    });

    it("invalidates cv detail query on success", () => {
        renderHook(() => useUpdateCV());

        const { onSuccess } = (useMutation as jest.Mock).mock.calls[0][0];

        onSuccess(undefined, { cvId: "cv-42", name: "Test" });

        expect(mockInvalidateQueries).toHaveBeenCalledWith({
            queryKey: ["cv", "detail", "cv-42"],
        });
    });
});
