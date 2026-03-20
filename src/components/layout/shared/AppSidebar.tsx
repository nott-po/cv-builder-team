"use client";

import { useTranslations } from "next-intl";

import { LogOut } from "lucide-react";

import { EmployeeAvatar } from "@/components/shared/EmployeeAvatar";
import { Separator } from "@/components/ui/separator";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import apiClient from "@/lib/api/client";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useUserData } from "@/lib/hooks/useUserData";
import { cn } from "@/lib/utils";

export type NavItem = {
    href: string;
    label: string;
    Icon: React.ElementType;
};

type AppSidebarProps = {
    navGroups: NavItem[][];
    userInitial: string;
    userDisplayName: string;
};

function DesktopNavList({ navGroups }: { navGroups: NavItem[][] }) {
    const pathname = usePathname();

    return (
        <nav className="mt-11 flex flex-col">
            {navGroups.map((group, gi) => (
                <div key={gi}>
                    {gi > 0 && <Separator className="my-3.5" />}
                    <div className="flex flex-col gap-3.5">
                        {group.map(({ href, label, Icon }) => {
                            const isActive = pathname === href || pathname.startsWith(href + "/");
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        "flex h-14 items-center rounded-tr-full rounded-br-full transition-colors",
                                        isActive
                                            ? "bg-background text-basic-text"
                                            : "text-text-secondary hover:bg-hover-xs",
                                    )}
                                >
                                    <Icon className="ml-4 size-6 shrink-0" />
                                    <span className="text-body tracking-standard ml-4 font-normal">
                                        {label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );
}

function MobileBottomNav({
    navGroups,
    userInitial,
    userDisplayName,
    logOutLabel,
    onLogout,
    avatar,
}: {
    navGroups: NavItem[][];
    userInitial: string;
    userDisplayName: string;
    logOutLabel: string;
    onLogout: () => void;
    avatar?: string | null;
}) {
    const pathname = usePathname();
    const flatItems = navGroups.flat();

    return (
        <nav
            aria-label="Mobile navigation"
            className="bg-surface border-divider fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center border-t px-2 md:hidden"
        >
            {flatItems.map(({ href, label, Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "flex flex-1 items-center justify-center gap-2 rounded-full px-2 py-2 transition-colors sm:px-3",
                            isActive
                                ? "bg-background text-basic-text"
                                : "text-text-secondary hover:bg-hover-xs",
                        )}
                    >
                        <Icon className="size-5 shrink-0" />
                        <span className="text-small tracking-standard hidden truncate font-normal sm:inline">
                            {label}
                        </span>
                    </Link>
                );
            })}

            <div className="ml-1 flex shrink-0 items-center gap-2 px-1 sm:ml-2 sm:px-2">
                <EmployeeAvatar initial={userInitial} avatar={avatar} size="sm" variant="primary" />
                <span className="text-small text-basic-text tracking-standard hidden max-w-20 truncate font-normal sm:inline">
                    {userDisplayName}
                </span>
            </div>

            <button
                onClick={onLogout}
                className="text-text-secondary hover:text-red-primary ml-1 flex shrink-0 items-center justify-center rounded-full p-2 transition-colors"
                aria-label={logOutLabel}
            >
                <LogOut className="size-5 shrink-0" />
            </button>
        </nav>
    );
}

export function AppSidebar({ navGroups, userInitial, userDisplayName }: AppSidebarProps) {
    const t = useTranslations("Common");
    const { user, clearUser } = useCurrentUser();
    const router = useRouter();

    const currentUserId = user?.id as string;
    const { data } = useUserData(currentUserId);
    const displayAvatar = data?.profile?.avatar;

    async function handleLogout() {
        await apiClient.post("/auth/logout");
        clearUser();
        router.push("/login");
    }

    return (
        <>
            <aside className="bg-surface hidden h-screen w-50 shrink-0 flex-col md:flex">
                <DesktopNavList navGroups={navGroups} />

                <div className="flex-1" />

                {/* User profile */}
                <Link
                    href="/profile"
                    className="ml-2 flex h-14 items-center overflow-hidden rounded-tr-full rounded-br-full"
                >
                    <EmployeeAvatar
                        initial={userInitial}
                        avatar={displayAvatar}
                        variant="primary"
                    />
                    <span className="text-body text-basic-text tracking-standard ml-3 truncate pr-2">
                        {userDisplayName}
                    </span>
                </Link>

                <Separator className="mt-2" />

                <button
                    onClick={handleLogout}
                    className="text-text-secondary hover:text-red-primary flex h-10 w-full items-center justify-center gap-3 transition-colors"
                    aria-label={t("log_out")}
                >
                    <LogOut className="size-5 shrink-0" />
                    <span className="text-body tracking-standard font-normal">{t("log_out")}</span>
                </button>
            </aside>

            <MobileBottomNav
                navGroups={navGroups}
                userInitial={userInitial}
                userDisplayName={userDisplayName}
                logOutLabel={t("log_out")}
                onLogout={handleLogout}
                avatar={displayAvatar}
            />
        </>
    );
}
