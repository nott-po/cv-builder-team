import { Mastery, Proficiency } from "@/generated/graphql";

export const MASTERY_COLOR: Record<Mastery, string> = {
    [Mastery.Novice]: "bg-proficiency-red",
    [Mastery.Competent]: "bg-proficiency-gray",
    [Mastery.Proficient]: "bg-proficiency-yellow",
    [Mastery.Advanced]: "bg-proficiency-blue",
    [Mastery.Expert]: "bg-proficiency-green",
};

export const MASTERY_TRACK_COLOR: Record<Mastery, string> = {
    [Mastery.Novice]: "bg-proficiency-red/20",
    [Mastery.Competent]: "bg-proficiency-gray/20",
    [Mastery.Proficient]: "bg-proficiency-yellow/20",
    [Mastery.Advanced]: "bg-proficiency-blue/20",
    [Mastery.Expert]: "bg-proficiency-green/20",
};

export const MASTERY_WIDTH: Record<Mastery, string> = {
    [Mastery.Novice]: "w-1/5",
    [Mastery.Competent]: "w-2/5",
    [Mastery.Proficient]: "w-3/5",
    [Mastery.Advanced]: "w-4/5",
    [Mastery.Expert]: "w-full",
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
