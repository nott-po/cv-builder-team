"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientError } from "graphql-request";
import { z } from "zod";

import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Button } from "@/components/ui/button";
import { FloatingLabelWrapper, floatingInputClass } from "@/components/ui/floating-label-wrapper";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
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
    DELETE_AVATAR_MUTATION,
    UPDATE_FULL_PROFILE_MUTATION,
    UPLOAD_AVATAR_MUTATION,
} from "@/lib/graphql/operations/employee";
import { CURRENT_USER_KEY, useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useDepartments } from "@/lib/hooks/useDepartments";
import { usePositions } from "@/lib/hooks/usePositions";
import { useUserData } from "@/lib/hooks/useUserData";

import { AvatarUpload, compressAvatar } from "./AvatarUpload";

const profileSchema = z.object({
    first_name: z.string().optional().or(z.literal("")),
    last_name: z.string().optional().or(z.literal("")),
    departmentId: z.string().optional().or(z.literal("")),
    positionId: z.string().optional().or(z.literal("")),
    avatar: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
    const t = useTranslations("User");
    const queryClient = useQueryClient();

    const { user: currentUser } = useCurrentUser();
    const currentUserId = currentUser?.id as string;

    const { data: departments = [], isLoading: isDepartmentsLoading } = useDepartments();
    const { data: positions = [], isLoading: isPositionsLoading } = usePositions();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const { data, isLoading, isError } = useUserData(currentUserId);

    const deleteAvatarMutation = useMutation({
        mutationFn: () =>
            gqlClient.request(DELETE_AVATAR_MUTATION, { avatar: { userId: currentUserId } }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employee", currentUserId] });
            queryClient.invalidateQueries({ queryKey: CURRENT_USER_KEY });
            setDeleteModalOpen(false);
            setDeleteError(null);
        },
        onError: () => {
            setDeleteError(t("delete_avatar_error"));
        },
    });

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

            const updateUserInput = {
                userId: currentUserId,
                ...(values.departmentId && { departmentId: values.departmentId }),
                ...(values.positionId && { positionId: values.positionId }),
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
            queryClient.invalidateQueries({ queryKey: CURRENT_USER_KEY });
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
            departmentId: data?.department?.id || "",
            positionId: data?.position?.id || "",
        },
    });

    const avatarFile = useWatch({ control: form.control, name: "avatar" });

    const { isDirty } = form.formState;

    const hasChanges = isDirty || avatarFile instanceof File;
    const isSubmitEnabled = hasChanges;

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
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field: { value: _value, onChange, ...fieldProps } }) => (
                                    <AvatarUpload
                                        currentAvatar={data?.profile?.avatar}
                                        initial={(
                                            data?.profile?.first_name?.[0] ??
                                            data?.email?.[0] ??
                                            "?"
                                        ).toUpperCase()}
                                        avatarFile={avatarFile instanceof File ? avatarFile : null}
                                        onChange={onChange}
                                        onDeleteRequest={() => setDeleteModalOpen(true)}
                                        fieldProps={fieldProps}
                                    />
                                )}
                            />

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
                                    <FormItem>
                                        <FloatingLabelWrapper label={t("first_name")}>
                                            <FormControl>
                                                <Input
                                                    variant="default"
                                                    className={floatingInputClass}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FloatingLabelWrapper>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FloatingLabelWrapper label={t("last_name")}>
                                            <FormControl>
                                                <Input
                                                    variant="default"
                                                    className={floatingInputClass}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FloatingLabelWrapper>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="departmentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FloatingLabelWrapper label={t("department")}>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || undefined}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className={floatingInputClass}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent
                                                    side="bottom"
                                                    avoidCollisions={false}
                                                    className="max-h-48"
                                                >
                                                    {isDepartmentsLoading ? (
                                                        <SelectItem value="loading" disabled>
                                                            {t("loading")}
                                                        </SelectItem>
                                                    ) : departments.length === 0 ? (
                                                        <SelectItem value="none" disabled>
                                                            {t("no_departments")}
                                                        </SelectItem>
                                                    ) : (
                                                        departments.map((department) => (
                                                            <SelectItem
                                                                key={department.id}
                                                                value={department.id}
                                                            >
                                                                {department.name}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FloatingLabelWrapper>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="positionId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FloatingLabelWrapper label={t("position")}>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || undefined}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className={floatingInputClass}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent
                                                    side="bottom"
                                                    avoidCollisions={false}
                                                    className="max-h-48"
                                                >
                                                    {isPositionsLoading ? (
                                                        <SelectItem value="loading" disabled>
                                                            {t("loading")}
                                                        </SelectItem>
                                                    ) : positions.length === 0 ? (
                                                        <SelectItem value="none" disabled>
                                                            {t("no_positions")}
                                                        </SelectItem>
                                                    ) : (
                                                        positions.map((position) => (
                                                            <SelectItem
                                                                key={position.id}
                                                                value={position.id}
                                                            >
                                                                {position.name}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FloatingLabelWrapper>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                className="col-start-1 mt-2 md:col-start-2"
                                type="submit"
                                disabled={updateProfileMutation.isPending || !isSubmitEnabled}
                                variant={
                                    updateProfileMutation.isPending || !isSubmitEnabled
                                        ? "grayBg"
                                        : "redPrimary"
                                }
                                size="updateButton"
                            >
                                {updateProfileMutation.isPending ? t("loading") : t("update")}
                            </Button>
                        </div>
                    </form>
                </Form>

                <DeleteConfirmModal
                    open={deleteModalOpen}
                    onOpenChange={(open) => {
                        setDeleteModalOpen(open);
                        if (!open) setDeleteError(null);
                    }}
                    title={t("delete_avatar_title")}
                    description={t("delete_avatar_confirm")}
                    onConfirm={() => deleteAvatarMutation.mutate()}
                    isPending={deleteAvatarMutation.isPending}
                    error={deleteError}
                />
            </div>
        </div>
    );
}
