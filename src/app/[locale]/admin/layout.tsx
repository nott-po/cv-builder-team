import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/layout/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-surface flex h-screen">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
        </div>
    );
}
