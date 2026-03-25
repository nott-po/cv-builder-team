import { useMutation } from "@tanstack/react-query";
import { renderHook, act } from "@testing-library/react";

import { useModalMutation } from "@/lib/hooks/useModalMutation";

jest.mock("@tanstack/react-query", () => ({
    useMutation: jest.fn(),
}));

describe("useModalMutation", () => {
    const mockOnSuccess = jest.fn();
    const mockOnClose = jest.fn();

    let capturedOnSuccess: () => void;

    beforeEach(() => {
        jest.clearAllMocks();

        (useMutation as jest.Mock).mockImplementation(({ onSuccess }) => {
            capturedOnSuccess = onSuccess;
            return {
                mutateAsync: jest.fn().mockResolvedValue(undefined),
                isPending: false,
            };
        });
    });

    it("returns initial state with no error and not pending", () => {
        const { result } = renderHook(() =>
            useModalMutation({
                mutationFn: jest.fn(),
                onSuccess: mockOnSuccess,
                onClose: mockOnClose,
            }),
        );

        expect(result.current.isPending).toBe(false);
        expect(result.current.submitError).toBeNull();
    });

    it("handleOpenChange calls onClose when not pending", () => {
        const { result } = renderHook(() =>
            useModalMutation({
                mutationFn: jest.fn(),
                onClose: mockOnClose,
            }),
        );

        act(() => {
            result.current.handleOpenChange(false);
        });

        expect(mockOnClose).toHaveBeenCalledWith(false);
    });

    it("handleOpenChange does not call onClose when pending", () => {
        (useMutation as jest.Mock).mockReturnValue({
            mutateAsync: jest.fn(),
            isPending: true,
        });

        const { result } = renderHook(() =>
            useModalMutation({
                mutationFn: jest.fn(),
                onClose: mockOnClose,
            }),
        );

        act(() => {
            result.current.handleOpenChange(false);
        });

        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("handleMutate calls mutateAsync and on success triggers onSuccess + onClose", async () => {
        const mockMutateAsync = jest.fn().mockResolvedValue("result");
        (useMutation as jest.Mock).mockImplementation(({ onSuccess }) => {
            capturedOnSuccess = onSuccess;
            return { mutateAsync: mockMutateAsync, isPending: false };
        });

        const { result } = renderHook(() =>
            useModalMutation({
                mutationFn: jest.fn(),
                onSuccess: mockOnSuccess,
                onClose: mockOnClose,
            }),
        );

        await act(async () => {
            await result.current.handleMutate("test-var", "Error msg");
        });

        expect(mockMutateAsync).toHaveBeenCalledWith("test-var");

        // Simulate useMutation's onSuccess callback
        act(() => {
            capturedOnSuccess();
        });

        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalledWith(false);
    });

    it("handleMutate sets error with string message on failure", async () => {
        const mockMutateAsync = jest.fn().mockRejectedValue(new Error("fail"));
        (useMutation as jest.Mock).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
        });

        const { result } = renderHook(() =>
            useModalMutation({
                mutationFn: jest.fn(),
                onClose: mockOnClose,
            }),
        );

        await act(async () => {
            await result.current.handleMutate("vars", "Something went wrong");
        });

        expect(result.current.submitError).toBe("Something went wrong");
    });

    it("handleMutate sets error with function message on failure", async () => {
        const mockError = new Error("duplicate key");
        const mockMutateAsync = jest.fn().mockRejectedValue(mockError);
        (useMutation as jest.Mock).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
        });

        const { result } = renderHook(() =>
            useModalMutation({
                mutationFn: jest.fn(),
                onClose: mockOnClose,
            }),
        );

        await act(async () => {
            await result.current.handleMutate("vars", (err) =>
                err instanceof Error ? `Custom: ${err.message}` : "Unknown",
            );
        });

        expect(result.current.submitError).toBe("Custom: duplicate key");
    });

    it("handleMutate clears previous error before retrying", async () => {
        const mockMutateAsync = jest
            .fn()
            .mockRejectedValueOnce(new Error("first"))
            .mockResolvedValueOnce(undefined);

        (useMutation as jest.Mock).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
        });

        const { result } = renderHook(() =>
            useModalMutation({
                mutationFn: jest.fn(),
                onClose: mockOnClose,
            }),
        );

        await act(async () => {
            await result.current.handleMutate("vars", "Error");
        });

        expect(result.current.submitError).toBe("Error");

        await act(async () => {
            await result.current.handleMutate("vars", "Error");
        });

        // Second call succeeds, error should be cleared (set to null before attempt)
        expect(result.current.submitError).toBeNull();
    });

    it("handleOpenChange clears error when closing", () => {
        const mockMutateAsync = jest.fn().mockRejectedValue(new Error("fail"));
        (useMutation as jest.Mock).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
        });

        const { result } = renderHook(() =>
            useModalMutation({
                mutationFn: jest.fn(),
                onClose: mockOnClose,
            }),
        );

        act(() => {
            result.current.handleOpenChange(false);
        });

        expect(result.current.submitError).toBeNull();
    });
});
