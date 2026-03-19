"use client";

import { useEffect, useMemo } from "react";

import { useTranslations } from "next-intl";

import { Upload } from "lucide-react";

import { EmployeeAvatar } from "@/components/shared/EmployeeAvatar";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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

interface AvatarUploadProps {
    currentAvatar?: string | null;
    initial: string;
    avatarFile?: File | null;
    onChange: (file: File) => void;
    fieldProps?: Record<string, unknown>;
}

export function AvatarUpload({
    currentAvatar,
    initial,
    avatarFile,
    onChange,
    fieldProps,
}: AvatarUploadProps) {
    const t = useTranslations("User");

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

    return (
        <div className="mb-8 flex items-center justify-center gap-6">
            <EmployeeAvatar size="xl" avatar={previewUrl} initial={initial} />

            <FormItem>
                <FormControl>
                    <Input
                        id="my-avatar-upload"
                        type="file"
                        accept="image/png, image/jpeg, image/gif, image/webp"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onChange(file);
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
                        {t("Upload_avatar_rules")}
                    </span>
                </FormLabel>
                <FormMessage />
            </FormItem>
        </div>
    );
}
