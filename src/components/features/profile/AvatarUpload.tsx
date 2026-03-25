"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useTranslations } from "next-intl";

import { Trash2, Upload } from "lucide-react";

import { EmployeeAvatar } from "@/components/shared/EmployeeAvatar";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/gif"];
const MAX_FILE_SIZE = 500 * 1024; // 500 KB

export type CompressedAvatar = { base64: string; size: number; type: string };

export const compressAvatar = (file: File): Promise<CompressedAvatar> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const MAX_WIDTH = 400;
                const MAX_HEIGHT = 400;
                let { width, height } = img;

                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }
                if (height > MAX_HEIGHT) {
                    width = Math.round((width * MAX_HEIGHT) / height);
                    height = MAX_HEIGHT;
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");

                if (!ctx) return reject(new Error("Canvas context is not available"));
                ctx.drawImage(img, 0, 0, width, height);

                const outputType = "image/jpeg";
                const dataUrl = canvas.toDataURL(outputType, 0.8);

                const rawBase64 = dataUrl.split(",")[1];
                const sizeInBytes = Math.round((rawBase64.length * 3) / 4);

                resolve({ base64: dataUrl, size: sizeInBytes, type: outputType });
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

function validateFile(file: File, t: (key: string) => string): string | null {
    if (!ACCEPTED_TYPES.includes(file.type)) return t("avatar_invalid_format");
    if (file.size > MAX_FILE_SIZE) return t("avatar_file_too_large");
    return null;
}

interface AvatarUploadProps {
    currentAvatar?: string | null;
    initial: string;
    avatarFile?: File | null;
    onChange: (file: File) => void;
    onDeleteRequest?: () => void;
    fieldProps?: Record<string, unknown>;
}

export function AvatarUpload({
    currentAvatar,
    initial,
    avatarFile,
    onChange,
    onDeleteRequest,
    fieldProps,
}: AvatarUploadProps) {
    const t = useTranslations("User");
    const [fileError, setFileError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const previewUrl = useMemo(() => {
        if (avatarFile instanceof File) {
            return URL.createObjectURL(avatarFile);
        }
        return currentAvatar ?? undefined;
    }, [avatarFile, currentAvatar]);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFile = useCallback(
        (file: File) => {
            const error = validateFile(file, t);
            setFileError(error);
            if (!error) onChange(file);
        },
        [onChange, t],
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile],
    );

    const showDeleteButton = !!(currentAvatar || avatarFile);

    return (
        <div
            className={cn(
                "mb-8 flex items-center justify-center gap-6 rounded-lg border-2 border-dashed p-4 transition-colors",
                isDragging ? "border-red-primary bg-hover-xs" : "border-transparent",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="relative">
                <EmployeeAvatar size="xl" avatar={previewUrl} initial={initial} />
                {showDeleteButton && onDeleteRequest && (
                    <button
                        type="button"
                        onClick={onDeleteRequest}
                        className="bg-destructive absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full text-white shadow-md transition-opacity hover:opacity-80"
                        aria-label={t("delete_avatar_title")}
                    >
                        <Trash2 className="size-4" />
                    </button>
                )}
            </div>

            <FormItem>
                <FormControl>
                    <Input
                        id="my-avatar-upload"
                        type="file"
                        accept=".png,.jpg,.jpeg,.gif"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFile(file);
                        }}
                        {...fieldProps}
                    />
                </FormControl>
                <FormLabel
                    htmlFor="my-avatar-upload"
                    className="group flex cursor-pointer flex-col gap-1"
                >
                    <div className="text-basic-text flex items-center gap-2 text-base font-medium transition-opacity group-hover:opacity-70">
                        <Upload className="size-5" />
                        {t("upload_avatar")}
                    </div>
                    <span className="text-text-secondary text-sm font-normal">
                        {t("upload_avatar_rules")}
<<<<<<< fix/code-review-fixes
                    </span>
                    <span className="text-text-secondary text-sm font-normal">
                        {t("avatar_drop_hint")}
=======
>>>>>>> develop
                    </span>
                </FormLabel>
                {fileError && <p className="text-destructive text-sm">{fileError}</p>}
                <FormMessage />
            </FormItem>
        </div>
    );
}
