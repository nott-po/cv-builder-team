import type { ReactNode } from "react";

import { UserSidebar } from "@/components/layout/user/UserSidebar";

export default function UserLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-surface flex h-screen">
            <UserSidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    );
}
