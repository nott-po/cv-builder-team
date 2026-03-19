"use client";

import React from "react";

import { ChevronRight } from "lucide-react";

import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
    label: string;
    href?: string;
    Icon?: React.ElementType;
};

interface PageHeaderProps {
    items: BreadcrumbItem[];
}

export function PageHeader({ items }: PageHeaderProps) {
    if (!items?.length) return null;

    return (
        <div className="flex items-center gap-3 px-11 pt-3 pb-3">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const isSecondElement = index % 2 === 1;

                let textColorClass = "";
                if (isSecondElement) {
                    textColorClass = "text-red-primary";
                } else {
                    textColorClass = isLast ? "text-header-item" : "text-input-default";
                }

                const IconComponent = item.Icon;

                const content = (
                    <span className="flex items-center gap-2">
                        {IconComponent && <IconComponent className="size-4 shrink-0" />}
                        {item.label && <span>{item.label}</span>}
                    </span>
                );

                return (
                    <React.Fragment key={item.label}>
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className={cn(
                                    "tracking-standard hover:text-basic-text flex items-center gap-1.5 text-base transition-colors",
                                    textColorClass,
                                )}
                            >
                                {content}
                            </Link>
                        ) : (
                            <h1
                                className={cn(
                                    "tracking-standard flex items-center gap-1.5 text-base",
                                    textColorClass,
                                )}
                            >
                                {content}
                            </h1>
                        )}

                        {!isLast && <ChevronRight className="text-chevron size-4 shrink-0" />}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
