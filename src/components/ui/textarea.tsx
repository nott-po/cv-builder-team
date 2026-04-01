import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
    ({ className, ...props }, ref) => (
        <textarea
            ref={ref}
            className={cn(
                "placeholder:text-muted-foreground w-full resize-none border-0 bg-transparent text-sm outline-none",
                className,
            )}
            {...props}
        />
    ),
);
Textarea.displayName = "Textarea";

export { Textarea };
