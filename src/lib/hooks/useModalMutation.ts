import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

interface UseModalMutationOptions<TData, TVariables> {
    mutationFn: (vars: TVariables) => Promise<TData>;
    onSuccess?: () => void;
    onClose: (open: boolean) => void;
}

export function useModalMutation<TData, TVariables>({
    mutationFn,
    onSuccess,
    onClose,
}: UseModalMutationOptions<TData, TVariables>) {
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn,
        onSuccess: () => {
            onSuccess?.();
            onClose(false);
        },
    });

    const handleOpenChange = (value: boolean) => {
        if (!isPending) {
            setSubmitError(null);
            onClose(value);
        }
    };

    const handleMutate = async (
        vars: TVariables,
        errorMessage: string | ((err: unknown) => string),
    ) => {
        setSubmitError(null);
        try {
            await mutateAsync(vars);
        } catch (err) {
            setSubmitError(typeof errorMessage === "function" ? errorMessage(err) : errorMessage);
        }
    };

    return { isPending, submitError, handleOpenChange, handleMutate };
}
