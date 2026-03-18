"use client";

import { useMemo } from "react";

import { useTranslations } from "next-intl";

import { useQuery } from "@tanstack/react-query";

import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { ProfileSkillTableSkeleton } from "@/components/shared/ProfileSkillTableSkeleton";
import { Mastery } from "@/generated/graphql";
import { gqlClient } from "@/lib/graphql/fetcher";
import { SKILLS_QUERY } from "@/lib/graphql/operations/skills";
import { useProfileSkills, type ProfileSkillRow } from "@/lib/hooks/useProfileSkills";
import { skillsListKey, type SkillsQueryResult } from "@/lib/hooks/useSkillTable";

const MASTERY_COLORS: Record<Mastery, string> = {
    [Mastery.Novice]: "bg-destructive",
    [Mastery.Competent]: "bg-orange-500",
    [Mastery.Proficient]: "bg-yellow-500",
    [Mastery.Advanced]: "bg-blue-500",
    [Mastery.Expert]: "bg-green-500",
};

type SkillGroup = {
    categoryName: string | null;
    skills: ProfileSkillRow[];
};

interface ProfileSkillTableProps {
    userId: string;
}

export function ProfileSkillsPage({ userId }: ProfileSkillTableProps) {
    const tUser = useTranslations("User");
    const { skills, isLoading, isError } = useProfileSkills(userId);

    const { data: allSkillsData } = useQuery<SkillsQueryResult>({
        queryKey: skillsListKey(),
        queryFn: () => gqlClient.request<SkillsQueryResult>(SKILLS_QUERY),
        staleTime: Infinity,
    });

    const grouped = useMemo<SkillGroup[]>(() => {
        if (skills.length === 0) return [];

        const skillMap = new Map((allSkillsData?.skills ?? []).map((s) => [s.name, s]));

        const groups = new Map<string | null, ProfileSkillRow[]>();

        for (const skill of skills) {
            const info = skillMap.get(skill.name);
            const category = info?.category_parent_name ?? info?.category_name ?? null;
            if (!groups.has(category)) groups.set(category, []);
            groups.get(category)!.push(skill);
        }

        return [...groups.entries()]
            .sort(([a], [b]) => {
                if (a === null) return 1;
                if (b === null) return -1;
                return a.localeCompare(b);
            })
            .map(([categoryName, groupSkills]) => ({ categoryName, skills: groupSkills }));
    }, [skills, allSkillsData]);

    if (isError) return <ErrorMessage message={tUser("error")} />;

    return (
        <div>
            {/* Content */}
            <div className="px-6 py-4">
                {isLoading ? (
                    <ProfileSkillTableSkeleton />
                ) : skills.length === 0 ? (
                    <p className="text-body text-text-secondary py-16 text-center">
                        {tUser("no_skills")}
                    </p>
                ) : (
                    <div className="space-y-8">
                        {grouped.map((group) => (
                            <div key={group.categoryName ?? "__uncategorized__"}>
                                {group.categoryName && (
                                    <h3 className="text-body text-basic-text mb-4 font-medium">
                                        {group.categoryName}
                                    </h3>
                                )}
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
                                    {group.skills.map((skill) => (
                                        <div
                                            key={skill.name}
                                            className="flex items-center gap-3 rounded px-2 py-2"
                                        >
                                            <span
                                                className={`h-1.5 w-16 flex-shrink-0 rounded-sm ${MASTERY_COLORS[skill.mastery]}`}
                                            />
                                            <span className="text-small text-basic-text tracking-standard flex-1 truncate">
                                                {skill.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
