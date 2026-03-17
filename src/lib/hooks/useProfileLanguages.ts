"use client";

import { useQuery } from "@tanstack/react-query";

import type { Proficiency } from "@/generated/graphql";
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
    });

    return {
        languages: data?.profile.languages ?? [],
        isLoading,
        isError,
    };
}
