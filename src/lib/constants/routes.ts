export const ROUTES = {
    LOGIN: "/login",
    SIGNUP: "/signup",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
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
    },
} as const;

export const PUBLIC_ROUTES = [
    ROUTES.LOGIN,
    ROUTES.SIGNUP,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
] as const;
