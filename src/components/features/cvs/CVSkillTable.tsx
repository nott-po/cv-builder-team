"use client";

import { useMemo, useState } from "react";

import { useTranslations } from "next-intl";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { ProfileSkillTableSkeleton } from "@/components/features/skills/profile/ProfileSkillTableSkeleton";
import { AddCVSkillModal } from "@/components/shared/AddCVSkillModal";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { RemoveProfileItemModal } from "@/components/shared/RemoveProfileItemModal";
import { RowActionsDropdown } from "@/components/shared/RowActionsDropdown";
import { Button } from "@/components/ui/button";
import { MASTERY_COLOR } from "@/lib/constants/proficiency";
import { gqlClient } from "@/lib/graphql/fetcher";
import { DELETE_CV_SKILL_MUTATION } from "@/lib/graphql/operations/cvs";
import { SKILLS_QUERY } from "@/lib/graphql/operations/skills";
import { useCv, cvDetailKey } from "@/lib/hooks/useCV";
import { skillsListKey, type SkillsQueryResult } from "@/lib/hooks/useSkillTable";

type CvSkillRow = {
    name: string;
    mastery: keyof typeof MASTERY_COLOR;
};

type SkillGroup = {
    categoryName: string | null;
    skills: CvSkillRow[];
};

interface CVSkillTableProps {
    cvId: string;
    readOnly?: boolean;
}

export function CVSkillTable({ cvId, readOnly = false }: CVSkillTableProps) {
    const t = useTranslations("CV");

    const { cv, isLoading: isCvLoading, isError: isCvError } = useCv(cvId);
    const cvSkills = useMemo(() => cv?.skills || [], [cv?.skills]);

    const { data: allSkillsData, isLoading: isLoadingAllSkills } = useQuery<SkillsQueryResult>({
        queryKey: skillsListKey(),
        queryFn: () => gqlClient.request<SkillsQueryResult>(SKILLS_QUERY),
        staleTime: Infinity,
    });

    const canAddMoreSkills =
        !readOnly &&
        (isLoadingAllSkills || (allSkillsData && cvSkills.length < allSkillsData.skills.length));

    const grouped = useMemo<SkillGroup[]>(() => {
        if (cvSkills.length === 0) return [];

        const skillMap = new Map((allSkillsData?.skills ?? []).map((s) => [s.name, s]));
        const groups = new Map<string | null, CvSkillRow[]>();

        for (const skill of cvSkills) {
            const info = skillMap.get(skill.name);
            const category = info?.category_parent_name ?? info?.category_name ?? null;
            if (!groups.has(category)) {
                groups.set(category, []);
            }
            const group = groups.get(category);
            if (group) {
                group.push(skill);
            }
        }

        return [...groups.entries()]
            .sort(([a], [b]) => {
                if (a === null) return 1;
                if (b === null) return -1;
                return a.localeCompare(b);
            })
            .map(([categoryName, groupSkills]) => ({ categoryName, skills: groupSkills }));
    }, [cvSkills, allSkillsData]);

    const [addOpen, setAddOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<CvSkillRow | null>(null);
    const [removeOpen, setRemoveOpen] = useState(false);
    const [removingSkill, setRemovingSkill] = useState<CvSkillRow | null>(null);

    if (isCvError) return <ErrorMessage message={t("error")} />;

    return (
        <div>
            {/* Content */}
            <div className="px-6 py-4">
                {isCvLoading ? (
                    <ProfileSkillTableSkeleton />
                ) : cvSkills.length === 0 ? (
                    <p className="text-body text-text-secondary py-16 text-center">
                        {t("no_skills")}
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
                                            className={`flex items-center gap-3 rounded px-2 py-2 ${
                                                readOnly
                                                    ? ""
                                                    : "hover:bg-hover-xs transition-colors"
                                            }`}
                                        >
                                            <span
                                                className={`h-1.5 w-16 flex-shrink-0 rounded-sm ${MASTERY_COLOR[skill.mastery]}`}
                                            />
                                            <span className="text-small text-basic-text tracking-standard flex-1 truncate">
                                                {skill.name}
                                            </span>
                                            {!readOnly && (
                                                <RowActionsDropdown
                                                    ariaLabel={t("skill_actions")}
                                                    onEdit={() => {
                                                        setEditingSkill(skill);
                                                        setAddOpen(true);
                                                    }}
                                                    onDelete={() => {
                                                        setRemovingSkill(skill);
                                                        setRemoveOpen(true);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            {canAddMoreSkills && (
                <div className="flex h-14 items-center justify-end gap-4 px-6">
                    <Button
                        variant="redText"
                        onClick={() => {
                            setEditingSkill(null);
                            setAddOpen(true);
                        }}
                    >
                        <Plus />
                        {t("add_skill")}
                    </Button>
                </div>
            )}

            {/* Modals */}
            {!readOnly && (
                <>
                    <AddCVSkillModal
                        open={addOpen}
                        cvId={cvId}
                        existingSkills={cvSkills}
                        editingSkill={editingSkill}
                        onOpenChange={(v) => {
                            setAddOpen(v);
                            if (!v) setEditingSkill(null);
                        }}
                    />

                    <RemoveProfileItemModal
                        open={removeOpen}
                        onOpenChange={(v) => {
                            setRemoveOpen(v);
                            if (!v) setRemovingSkill(null);
                        }}
                        title={t("remove_skill_title")}
                        confirmText={t("remove_skill_confirm")}
                        itemName={removingSkill?.name}
                        errorMessage={t("remove_skill_error")}
                        mutationFn={(name) =>
                            gqlClient.request(DELETE_CV_SKILL_MUTATION, {
                                skill: { cvId, name: [name] },
                            })
                        }
                        queryKey={cvDetailKey(cvId)}
                    />
                </>
            )}
        </div>
    );
}
