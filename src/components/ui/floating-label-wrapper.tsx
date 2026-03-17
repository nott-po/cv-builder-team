import type { ReactNode } from "react";

type FloatingLabelWrapperProps = {
    label: string;
    children: ReactNode;
    error?: boolean;
};

export function FloatingLabelWrapper({ label, children, error }: FloatingLabelWrapperProps) {
    return (
        <div
            className={`relative border ${error ? "border-destructive" : "border-border-input-default"}`}
        >
            <span className="bg-background text-muted-foreground absolute -top-2.5 left-3 px-1 text-xs leading-none">
                {label}
            </span>
            {children}
        </div>
    );
}

export const floatingSelectTriggerClass =
    "text-input-default h-auto border-0 px-3 py-4 shadow-none focus:ring-0";
