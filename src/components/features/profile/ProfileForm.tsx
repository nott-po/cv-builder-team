"use client";

import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientError } from "graphql-request";
import { Upload } from "lucide-react";
import * as z from "zod";

import { EmployeeAvatar } from "@/components/shared/EmployeeAvatar";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { gqlClient } from "@/lib/graphql/fetcher";
import {
    UPDATE_FULL_PROFILE_MUTATION,
    UPLOAD_AVATAR_MUTATION,
} from "@/lib/graphql/operations/employee";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useDepartments } from "@/lib/hooks/useDepartments";
import { usePositions } from "@/lib/hooks/usePositions";
import { useUserData } from "@/lib/hooks/useUserData";

const profileSchema = z.object({
    first_name: z.string().min(1, "First name is required").optional().or(z.literal("")),
    last_name: z.string().min(1, "Last name is required").optional().or(z.literal("")),
    department_name: z.string().optional().or(z.literal("")),
    position_name: z.string().optional().or(z.literal("")),
    avatar: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const compressAvatar = (file: File): Promise<{ base64: string; size: number; type: string }> => {
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

                const base64 = dataUrl.split(",")[1];

                const sizeInBytes = Math.round((base64.length * 3) / 4);

                resolve({ base64, size: sizeInBytes, type: outputType });
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

export function ProfileForm() {
    const t = useTranslations("User");
    const queryClient = useQueryClient();

    const { user: currentUser } = useCurrentUser();
    const currentUserId = currentUser?.id as string;

    const { data: departments = [], isLoading: isDepartmentsLoading } = useDepartments();
    const { data: positions = [], isLoading: isPositionsLoading } = usePositions();

    const { data, isLoading, isError } = useUserData(currentUserId);
    const updateProfileMutation = useMutation({
        mutationFn: async (values: ProfileFormValues) => {
            if (values.avatar instanceof File) {
                const compressedAvatar = await compressAvatar(values.avatar);

                await gqlClient.request(UPLOAD_AVATAR_MUTATION, {
                    avatar: {
                        userId: currentUserId,
                        base64: compressedAvatar.base64,
                        size: compressedAvatar.size,
                        type: compressedAvatar.type,
                    },
                });
            }

            const selectedDept = departments.find((d) => d.name === values.department_name);
            const selectedPos = positions.find((p) => p.name === values.position_name);

            const updateUserInput = {
                userId: currentUserId,
                ...(selectedDept?.id && { departmentId: selectedDept.id }),
                ...(selectedPos?.id && { positionId: selectedPos.id }),
            };

            const updateProfileInput = {
                userId: currentUserId,
                first_name: values.first_name,
                last_name: values.last_name,
            };

            const response = await gqlClient.request(UPDATE_FULL_PROFILE_MUTATION, {
                user: updateUserInput,
                profile: updateProfileInput,
            });

            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employee", currentUserId] });
            form.clearErrors("root");
        },
        onError: (error) => {
            let errorMessage = t("error");

            if (error instanceof ClientError) {
                errorMessage = error.response.errors?.[0]?.message || errorMessage;
            } else {
                errorMessage = error.message;
            }
            form.setError("root", { type: "server", message: errorMessage });
        },
    });

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        values: {
            first_name: data?.profile?.first_name || "",
            last_name: data?.profile?.last_name || "",
            department_name: data?.department_name || "",
            position_name: data?.position_name || "",
        },
    });

    const avatarFile = useWatch({ control: form.control, name: "avatar" });

    const previewUrl = useMemo(() => {
        if (avatarFile && avatarFile instanceof File) {
            return URL.createObjectURL(avatarFile);
        }
        return data?.profile?.avatar;
    }, [avatarFile, data?.profile?.avatar]);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    function onSubmit(values: ProfileFormValues) {
        updateProfileMutation.mutate(values);
    }

    const isActuallyLoading =
        isLoading || !currentUserId || isDepartmentsLoading || isPositionsLoading;

    if ((!isActuallyLoading && !data) || isError) {
        return <ErrorMessage message={t("error")} />;
    }

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-213 p-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mx-auto w-full space-y-6"
                    >
                        <div className="mb-8 items-center gap-6">
                            <div className="mb-8 flex items-center justify-center gap-6">
                                <EmployeeAvatar
                                    size="xl"
                                    avatar={previewUrl}
                                    initial={(
                                        data?.profile?.first_name?.[0] ??
                                        data?.email?.[0] ??
                                        "?"
                                    ).toUpperCase()}
                                />

                                <FormField
                                    control={form.control}
                                    name="avatar"
                                    render={({
                                        field: { value: _value, onChange, ...fieldProps },
                                    }) => (
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
                                    )}
                                />
                            </div>

                            {isActuallyLoading ? (
                                <div className="flex flex-col gap-1">
                                    <Skeleton className="mx-auto mb-2 h-6 w-50" />
                                    <Skeleton className="mx-auto h-6 w-30" />
                                    <Skeleton className="mx-auto h-6 w-40" />
                                </div>
                            ) : (
                                <div>
                                    <p className="text-basic-text mb-2 text-center text-2xl font-medium">
                                        {data?.profile?.first_name} {data?.profile?.last_name}
                                    </p>
                                    <p className="text-input-default text-center">{data?.email}</p>
                                    <p className="text-basic-text text-center">
                                        {t("member_since")}{" "}
                                        {data?.created_at &&
                                            new Date(Number(data.created_at)).toDateString()}
                                    </p>

                                    {form.formState.errors.root && (
                                        <p className="text-destructive mt-2 text-center text-sm">
                                            {form.formState.errors.root.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="grid w-full grid-cols-1 gap-x-8 gap-y-9 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem className="relative">
                                        <FormLabel className="bg-surface text-muted-foreground absolute -top-2.5 left-3 z-10 px-1 text-xs leading-none">
                                            {t("first_name")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                variant="default"
                                                {...field}
                                                size="default"
                                                className="relative z-0 text-base"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem className="relative">
                                        <FormLabel className="bg-surface text-muted-foreground absolute -top-2.5 left-3 z-10 px-1 text-xs leading-none">
                                            {t("last_name")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                variant="default"
                                                className="relative z-0 text-base"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="department_name"
                                render={({ field }) => (
                                    <FormItem className="relative">
                                        <FormLabel className="bg-surface text-muted-foreground absolute -top-2.5 left-3 z-10 px-1 text-xs leading-none">
                                            {t("department")}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || undefined}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="border-border-input-default relative z-0 h-auto min-h-[56px] rounded-none border px-3 py-4 shadow-none focus:ring-0">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent side="bottom" avoidCollisions={false}>
                                                {isDepartmentsLoading ? (
                                                    <SelectItem value="loading" disabled>
                                                        Loading...
                                                    </SelectItem>
                                                ) : departments.length === 0 ? (
                                                    <SelectItem value="none" disabled>
                                                        No departments
                                                    </SelectItem>
                                                ) : (
                                                    departments.map((department) => (
                                                        <SelectItem
                                                            key={department.id}
                                                            value={department.name}
                                                        >
                                                            {department.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="position_name"
                                render={({ field }) => (
                                    <FormItem className="relative">
                                        <FormLabel className="bg-surface text-muted-foreground absolute -top-2.5 left-3 z-10 px-1 text-xs leading-none">
                                            {t("position")}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || undefined}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="border-border-input-default relative z-0 h-auto min-h-[56px] rounded-none border px-3 py-4 shadow-none focus:ring-0">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent side="bottom" avoidCollisions={false}>
                                                {isPositionsLoading ? (
                                                    <SelectItem value="loading" disabled>
                                                        Loading...
                                                    </SelectItem>
                                                ) : positions.length === 0 ? (
                                                    <SelectItem value="none" disabled>
                                                        No positions
                                                    </SelectItem>
                                                ) : (
                                                    positions.map((position) => (
                                                        <SelectItem
                                                            key={position.id}
                                                            value={position.name}
                                                        >
                                                            {position.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                className="text-gray-button-text col-start-1 mt-2 md:col-start-2"
                                type="submit"
                                disabled={updateProfileMutation.isPending}
                                variant="grayBg"
                                size="updateButton"
                            >
                                {updateProfileMutation.isPending ? "Saving..." : t("update")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
