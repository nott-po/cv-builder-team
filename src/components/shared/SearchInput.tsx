"use client";

import { Search } from "lucide-react";

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
    return (
        <div className="relative w-80">
            <Search className="text-text-hint absolute top-1/2 left-3 size-6 -translate-y-1/2" />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border-border-input-default bg-surface text-body text-basic-text tracking-standard placeholder:text-text-placeholder focus:border-text-hint h-10 w-full rounded-full border pr-4 pl-10 transition-colors outline-none"
            />
        </div>
    );
}
