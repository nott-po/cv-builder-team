export const ROUTES = {
    LOGIN: "/login",
    SIGNUP: "/signup",
    EMPLOYEES: "/employees",
    PROFILE: "/profile",
    SKILLS: "/skills",
    LANGUAGES: "/languages",
    CVS: "/cvs",
    SETTINGS: "/settings",
    ADMIN: {
        EMPLOYEES: "/admin/employees",
        DEPARTMENTS: "/admin/departments",
        POSITIONS: "/admin/positions",
        SKILLS: "/admin/skills",
        LANGUAGES: "/admin/languages",
        PROJECTS: "/admin/projects",
        CVS: "/admin/cvs",
        SETTINGS: "/admin/settings",
        PROFILE: "/admin/profile",
    },
} as const;

export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.SIGNUP] as const;
