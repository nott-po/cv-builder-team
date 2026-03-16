"use client"; // Добавьте эту директиву в начало файла
import { useState } from "react";

import { EmployeeProfile } from "@/components/features/employees/EmployeeProfile";
import { UserHeader } from "@/components/layout/user/UserHeader";

export default function EmployeeDetailsPage() {
    const [currentMode, setCurrentMode] = useState<"profile" | "skills" | "language">("profile");

    return (
        <div className="px-6">
            <UserHeader mode={currentMode} onModeChange={setCurrentMode} />
            {currentMode === "profile" && <EmployeeProfile />}
            {currentMode === "skills" && <div>Skills Component</div>}
            {currentMode === "language" && <div>Language Component</div>}
        </div>
    );
}
