"use client";

import { useMemo, useState } from "react";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { gqlClient } from "@/lib/graphql/fetcher";
import { EXPORT_PDF_MUTATION } from "@/lib/graphql/operations/cvs";
import { SKILLS_QUERY } from "@/lib/graphql/operations/skills";
import { useCv } from "@/lib/hooks/useCV";
import type { ProfileSkillRow } from "@/lib/hooks/useProfileSkills";
import { skillsListKey, type SkillsQueryResult } from "@/lib/hooks/useSkillTable";

type SkillGroup = {
    categoryName: string | null;
    skills: ProfileSkillRow[];
};

export function CVPreview() {
    const params = useParams();
    const cvId = params.id as string;
    const t = useTranslations("CV");
    const { cv } = useCv(cvId);

    const [isExporting, setIsExporting] = useState(false);
    const { data: allSkillsData } = useQuery<SkillsQueryResult>({
        queryKey: skillsListKey(),
        queryFn: () => gqlClient.request<SkillsQueryResult>(SKILLS_QUERY),
        staleTime: Infinity,
    });

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const cvElement = document.getElementById("cv-wrapper");
            if (!cvElement) throw new Error("CV element not found");

            const clone = cvElement.cloneNode(true) as HTMLElement;
            const btn = clone.querySelector("#export-button");
            if (btn) btn.remove();

            let inlineStyles = "";
            const styleNodes = document.querySelectorAll('style, link[rel="stylesheet"]');

            for (const node of Array.from(styleNodes)) {
                if (node.tagName === "STYLE") {
                    inlineStyles += node.outerHTML;
                } else if (node.tagName === "LINK") {
                    try {
                        const href = (node as HTMLLinkElement).href;
                        const res = await fetch(href);
                        const css = await res.text();
                        inlineStyles += `<style>${css}</style>\n`;
                    } catch (e) {
                        console.warn("Failed to load stylesheet:", e);
                    }
                }
            }

            const finalHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    ${inlineStyles}
                </head>
                <body class="bg-white text-black">
                    ${clone.outerHTML}
                </body>
                </html>
            `;

            const response = await gqlClient.request(EXPORT_PDF_MUTATION, {
                pdf: { html: finalHtml },
            });

            const base64Pdf = response.exportPdf;
            const linkSource = `data:application/pdf;base64,${base64Pdf}`;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = `CV_${cv?.user?.profile?.full_name || "Employee"}.pdf`;
            downloadLink.click();
        } catch (error) {
            console.error("Export failed:", error);
            toast.error(t("export_error"));
        } finally {
            setIsExporting(false);
        }
    };

    const uniqueDomains = useMemo(
        () => [...new Set((cv?.projects ?? []).map((p) => p.domain).filter(Boolean))],
        [cv?.projects],
    );

    const grouped = useMemo<SkillGroup[]>(() => {
        if (!cv || !cv.skills || cv.skills.length === 0) return [];

        const skillMap = new Map((allSkillsData?.skills ?? []).map((s) => [s.name, s]));

        const groups = new Map<string | null, ProfileSkillRow[]>();

        for (const skill of cv.skills) {
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
    }, [cv, allSkillsData]);

    if (!cv) {
        return (
            <div className="flex flex-col items-center">
                <div className="flex w-full max-w-225 animate-pulse flex-col items-center gap-8 px-12 py-4">
                    <div className="flex w-full justify-between">
                        <div className="flex flex-col gap-3">
                            <div className="h-10 w-64 rounded-md bg-gray-200" />
                            <div className="h-6 w-40 rounded-md bg-gray-200" />
                        </div>
                        <div className="h-10 w-32 rounded-md bg-gray-200" />
                    </div>
                    <div className="flex w-full">
                        <div className="flex w-2/5 flex-col gap-6 py-4 pr-6">
                            <div className="h-16 w-full rounded-md bg-gray-200" />
                            <div className="h-16 w-full rounded-md bg-gray-200" />
                            <div className="h-16 w-full rounded-md bg-gray-200" />
                        </div>
                        <div className="w-[1px] shrink-0 self-stretch bg-gray-200" />
                        <div className="flex flex-1 flex-col gap-6 py-4 pl-6">
                            <div className="h-24 w-full rounded-md bg-gray-200" />
                            <div className="h-48 w-full rounded-md bg-gray-200" />
                        </div>
                    </div>
                    <div className="h-10 w-48 self-start rounded-md bg-gray-200" />
                    <div className="h-40 w-full rounded-md bg-gray-200" />
                </div>
            </div>
        );
    }

    return (
        <div id="cv-wrapper" className="flex flex-col items-center">
            <div className="flex w-full max-w-225 flex-col items-center gap-8 px-12 py-4">
                <div className="flex w-full justify-between">
                    <div>
                        <p className="text-[34px]">{cv?.user?.profile.full_name}</p>
                        {cv.user?.position_name && (
                            <p className="uppercase">{cv.user.position_name}</p>
                        )}
                    </div>
                    <div id="export-button">
                        <Button
                            variant="redBorder"
                            size="redBorderButton"
                            onClick={handleExport}
                            disabled={isExporting}
                        >
                            {isExporting ? `${t("generating")}...` : t("export_pdf")}
                        </Button>
                    </div>
                </div>

                <div className="w-full">
                    <div className="flex">
                        <div className="flex w-2/5 flex-col gap-4 py-4 pr-6">
                            <div className="flex flex-col gap-2">
                                <p className="font-bold">{t("education")}</p>
                                <p>{cv.education}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="font-bold">{t("language_proficiency")}</p>
                                {cv.languages && cv.languages.length > 0 ? (
                                    <ul className="space-y-1">
                                        {cv.languages.map((lang) => (
                                            <li key={lang.name} className="text-sm">
                                                {lang.name} — {lang.proficiency}
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="font-bold">{t("domains")}</p>
                                {uniqueDomains.length > 0 ? (
                                    <ul className="space-y-1">
                                        {uniqueDomains.map((domain) => (
                                            <li key={domain} className="text-sm">
                                                {domain}
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                        </div>

                        <div className="bg-red-primary w-[1px] shrink-0 self-stretch" />

                        <div className="flex flex-1 flex-col gap-4 py-4 pl-6">
                            <div className="flex flex-col gap-2">
                                <p className="font-bold">{cv.name}</p>
                                <div>{cv.description}</div>
                            </div>

                            <div className="flex flex-col gap-2">
                                {cv?.skills?.length === 0 ? (
                                    <p className="text-body text-text-secondary py-16 text-center">
                                        {t("no_skills")}
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {grouped.map((group) => (
                                            <div
                                                key={group.categoryName ?? "Other"}
                                                className="flex flex-col gap-2"
                                            >
                                                <p className="font-bold">
                                                    {group.categoryName ?? t("other")}
                                                </p>
                                                <p>
                                                    {group.skills
                                                        .map((skill) => skill.name)
                                                        .join(", ")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="w-full text-[34px]">{t("projects")}</p>

                <div className="flex flex-col gap-8">
                    {cv?.projects?.map((project) => (
                        <div key={project.id} className="flex">
                            <div className="flex w-2/5 flex-col gap-4 py-4 pr-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-red-primary font-bold uppercase">
                                            {project.name}
                                        </p>
                                        <div>{project.description}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-primary w-[1px] shrink-0 self-stretch" />

                            <div className="flex flex-1 flex-col gap-4 py-4 pl-6">
                                <div className="flex flex-col gap-2">
                                    <p className="font-bold">{t("project_roles")}</p>
                                    <div>{project.roles.join(", ")}</div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="font-bold">{t("period")}</p>
                                    <p>
                                        {project.start_date} – {project?.end_date || t("till_now")}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="font-bold">{t("responsibilities")}</p>
                                    <ul className="list-none">
                                        {project.responsibilities.map((responsibility) => (
                                            <li
                                                key={responsibility}
                                                className="relative pl-5 before:absolute before:top-2.5 before:left-1.5 before:h-1 before:w-1 before:rounded-full before:bg-current before:content-['']"
                                            >
                                                {responsibility}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="w-full text-[34px]">{t("professional_skills")}</p>

                <div className="w-full">
                    <table className="w-full">
                        <thead className="border-b-red-primary border-b-[2px]">
                            <tr className="">
                                <th
                                    scope="col"
                                    className="px-4 pt-2.5 pb-7 text-left text-sm font-medium uppercase"
                                >
                                    {t("category")}
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 pt-2.5 pb-7 text-left text-sm font-medium uppercase"
                                >
                                    {t("skills")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {grouped.map((group) => (
                                <tr
                                    key={group.categoryName ?? t("other")}
                                    className="border-divider border-b-[2px]"
                                >
                                    <th className="text-red-primary px-4 pt-2.5 pb-7 text-left align-top text-sm">
                                        {group.categoryName ?? t("other")}
                                    </th>
                                    <td className="flex flex-col gap-5 px-4 pt-2.5 pb-7 text-left align-top text-sm">
                                        {group.skills.map((skill) => (
                                            <p key={skill.name}>{skill.name}</p>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
