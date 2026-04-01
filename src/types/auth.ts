import { type UserRole } from "@/lib/constants/roles";

export type SessionUser = {
    id: string;
    email: string;
    role: UserRole;
};

export type SessionData = {
    user?: SessionUser;
    accessToken?: string;
    refreshToken?: string;
};
