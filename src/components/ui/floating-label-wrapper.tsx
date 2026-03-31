import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FloatingLabelWrapperProps = {
    label: string;
    children: ReactNode;
    error?: boolean;
    className?: string;
};

export function FloatingLabelWrapper({
    label,
    children,
    error,
    className,
}: FloatingLabelWrapperProps) {
    return (
        <div
            className={cn(
                "relative border",
                error ? "border-destructive" : "border-border-input-default",
                className,
            )}
        >
            <span className="bg-surface text-muted-foreground absolute -top-2.5 left-3 px-1 text-xs leading-none">
                {label}
            </span>
            {children}
        </div>
    );
}

export const floatingInputClass =
    "text-input-default h-auto border-0 px-3 py-4 shadow-none focus:ring-0";
