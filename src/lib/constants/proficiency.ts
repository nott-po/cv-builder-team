import { Mastery, Proficiency } from "@/generated/graphql";

export const MASTERY_COLOR: Record<Mastery, string> = {
    [Mastery.Novice]: "bg-destructive",
    [Mastery.Competent]: "bg-proficiency-orange",
    [Mastery.Proficient]: "bg-proficiency-yellow",
    [Mastery.Advanced]: "bg-proficiency-blue",
    [Mastery.Expert]: "bg-proficiency-green",
};

export const PROFICIENCY_COLOR: Record<Proficiency, string> = {
    [Proficiency.A1]: "text-text-secondary",
    [Proficiency.A2]: "text-text-secondary",
    [Proficiency.B1]: "text-proficiency-green",
    [Proficiency.B2]: "text-proficiency-green",
    [Proficiency.C1]: "text-proficiency-blue",
    [Proficiency.C2]: "text-proficiency-blue",
    [Proficiency.Native]: "text-destructive",
};
