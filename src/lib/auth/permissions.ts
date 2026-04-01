import { PUBLIC_ROUTES } from "@/lib/constants/routes";
import { UserRole } from "@/lib/constants/roles";

export function isPublicPath(pathname: string): boolean {
    return PUBLIC_ROUTES.some((route) => pathname === route);
}

export function isAdminPath(pathname: string): boolean {
    return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function canAccess(pathname: string, role: UserRole): boolean {
    if (isAdminPath(pathname)) {
        return role === UserRole.Admin;
    }
    return true;
}
