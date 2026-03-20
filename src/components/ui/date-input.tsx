import type { ComponentProps } from "react";

import { FloatingLabelWrapper, floatingInputClass } from "./floating-label-wrapper";

type DateInputProps = Omit<ComponentProps<"input">, "type"> & {
    label: string;
    error?: boolean;
};

export function DateInput({ label, error, ...props }: DateInputProps) {
    return (
        <FloatingLabelWrapper label={label} error={error}>
            <input type="date" className={`${floatingInputClass} w-full`} {...props} />
        </FloatingLabelWrapper>
    );
}
