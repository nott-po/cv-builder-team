"use client";

import { useEffect, useRef, useState } from "react";

import { Search } from "lucide-react";

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
};

export function SearchInput({ value, onChange, placeholder, debounceMs = 300 }: SearchInputProps) {
    const [localValue, setLocalValue] = useState(value);
    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        if (localValue === value) return;
        const timer = setTimeout(() => onChangeRef.current(localValue), debounceMs);
        return () => clearTimeout(timer);
    }, [localValue, debounceMs, value]);

    return (
        <div className="relative w-80">
            <Search className="text-text-hint absolute top-1/2 left-3 size-6 -translate-y-1/2" />
            <input
                type="text"
                placeholder={placeholder}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="border-border-input-default bg-surface text-body text-basic-text tracking-standard placeholder:text-text-placeholder focus:border-text-hint h-10 w-full rounded-full border pr-4 pl-10 transition-colors outline-none"
            />
        </div>
    );
}
