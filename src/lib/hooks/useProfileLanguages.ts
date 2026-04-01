"use client";

import { useQuery } from "@tanstack/react-query";

import type { Proficiency } from "@/generated/graphql";
import { STALE_TIME_ENTITY } from "@/lib/constants/query";
import { gqlClient } from "@/lib/graphql/fetcher";
import { PROFILE_LANGUAGES_QUERY } from "@/lib/graphql/operations/profile";

export type ProfileLanguageRow = {
    name: string;
    proficiency: Proficiency;
};

type ProfileLanguagesQueryResult = {
    profile: {
        id: string;
        languages: ProfileLanguageRow[];
    };
};

export const profileLanguagesKey = (userId: string) => ["profile", userId, "languages"] as const;

export function useProfileLanguages(userId: string) {
    const { data, isLoading, isError } = useQuery<ProfileLanguagesQueryResult>({
        queryKey: profileLanguagesKey(userId),
        queryFn: () =>
            gqlClient.request<ProfileLanguagesQueryResult>(PROFILE_LANGUAGES_QUERY, { userId }),
        enabled: !!userId,
        staleTime: STALE_TIME_ENTITY,
    });

    return {
        languages: data?.profile.languages ?? [],
        isLoading,
        isError,
    };
}
