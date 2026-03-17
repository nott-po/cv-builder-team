"use client";

import { useQuery } from "@tanstack/react-query";

import type { Mastery } from "@/generated/graphql";
import { gqlClient } from "@/lib/graphql/fetcher";
import { PROFILE_SKILLS_QUERY } from "@/lib/graphql/operations/profile";

export type ProfileSkillRow = {
    name: string;
    mastery: Mastery;
};

type ProfileSkillsQueryResult = {
    profile: {
        id: string;
        skills: ProfileSkillRow[];
    };
};

export const profileSkillsKey = (userId: string) => ["profile", userId, "skills"] as const;

export function useProfileSkills(userId: string) {
    const { data, isLoading, isError } = useQuery<ProfileSkillsQueryResult>({
        queryKey: profileSkillsKey(userId),
        queryFn: () =>
            gqlClient.request<ProfileSkillsQueryResult>(PROFILE_SKILLS_QUERY, { userId }),
        enabled: !!userId,
    });

    return {
        skills: data?.profile.skills ?? [],
        isLoading,
        isError,
    };
}
