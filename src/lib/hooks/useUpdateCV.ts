"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { gqlClient } from "@/lib/graphql/fetcher";
import { UPDATE_CV_MUTATION } from "@/lib/graphql/operations/cvs";

import { cvDetailKey } from "./useCV";

export type UpdateCvInputData = {
    cvId: string;
    name: string;
    education?: string | null;
    description?: string | null;
};

export function useUpdateCV() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (cvInput: UpdateCvInputData) => {
            return gqlClient.request(UPDATE_CV_MUTATION, { cv: cvInput });
        },

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: cvDetailKey(variables.cvId),
            });
        },
    });
}
