"use client";

import { useQuery } from "@tanstack/react-query";

import type { Mastery } from "@/generated/graphql";
import { gqlClient } from "@/lib/graphql/fetcher";
import { CV_QUERY } from "@/lib/graphql/operations/cvs";

export type CvDetail = {
    id: string;
    created_at: string;
    name: string;
    education?: string | null;
    description: string;
    user?: {
        id: string;
        email?: string;
    } | null;
    projects?: {
        id: string;
        name: string;
    }[];
    skills?: {
        name: string;
        mastery: Mastery;
    }[];
    languages?: {
        name: string;
        proficiency: string;
    }[];
};

type CvQueryResult = {
    cv: CvDetail;
};

export const cvDetailKey = (cvId: string) => ["cv", "detail", cvId] as const;

export function useCv(cvId: string) {
    const { data, isLoading, isError, refetch } = useQuery<CvDetail>({
        enabled: Boolean(cvId),

        queryKey: cvDetailKey(cvId),

        queryFn: async () => {
            const response = await gqlClient.request<CvQueryResult>(CV_QUERY, { cvId });
            return response.cv;
        },
    });

    return {
        cv: data,
        isLoading,
        isError,
        refetch,
    };
}
