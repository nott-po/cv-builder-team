import Image from "next/image";

import { cn } from "@/lib/utils";

type EmployeeAvatarProps = {
    initial: string;
    avatar?: string | null;
    size?: "md" | "sm";
    variant?: "default" | "primary";
};

const sizeMap = {
    md: { container: "size-10", text: "text-title", image: 40 },
    sm: { container: "size-8", text: "text-xs", image: 32 },
} as const;

export function EmployeeAvatar({
    initial,
    avatar,
    size = "md",
    variant = "default",
}: EmployeeAvatarProps) {
    const { container, text, image } = sizeMap[size];

    if (avatar) {
        return (
            <Image
                src={avatar}
                alt=""
                width={image}
                height={image}
                className={cn(container, "rounded-full object-cover")}
            />
        );
    }

    return (
        <div
            className={cn(
                "flex shrink-0 items-center justify-center rounded-full",
                container,
                variant === "primary" ? "bg-red-primary" : "bg-avatar-default",
            )}
        >
            <span className={cn(text, "text-surface leading-none font-medium uppercase")}>
                {initial}
            </span>
        </div>
    );
}
