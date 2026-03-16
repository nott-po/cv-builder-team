"use client";

import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import * as z from "zod";

import { EmployeeAvatar } from "@/components/shared/EmployeeAvatar";
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
import { useUserData } from "@/lib/hooks/useUserData";

const profileSchema = z.object({
    first_name: z.string().min(1, "First name is required").optional().or(z.literal("")),
    last_name: z.string().min(1, "Last name is required").optional().or(z.literal("")),
    department_name: z.string().optional().or(z.literal("")),
    position_name: z.string().optional().or(z.literal("")),
    avatar: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function EmployeeProfile() {
    const t = useTranslations("User");
    const params = useParams();
    const employeeId = params?.id as string;

    const { data, isLoading, isError } = useUserData(employeeId);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        values: {
            first_name: data?.profile?.first_name || "",
            last_name: data?.profile?.last_name || "",
            department_name: data?.department_name || "",
            position_name: data?.position_name || "",
        },
    });

    const positions = {};
    const departments = {};

    const avatarFile = useWatch({
        control: form.control,
        name: "avatar",
    });

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
        // eslint-disable-next-line no-console
        console.log("data for posting to the server", values);
    }

    if (isLoading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (isError || !data) {
        return <div className="p-8 text-center text-red-500">Error loading profile</div>;
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
                                        data.profile.first_name?.[0] ??
                                        data.email?.[0] ??
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
                                                    id="avatar-upload"
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/gif, image/webp"
                                                    className="hidden"
                                                    onChange={(event) => {
                                                        const file =
                                                            event.target.files &&
                                                            event.target.files[0];
                                                        if (file) {
                                                            onChange(file);
                                                        }
                                                    }}
                                                    {...fieldProps}
                                                />
                                            </FormControl>

                                            <FormLabel
                                                htmlFor="avatar-upload"
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

                            <div>
                                <p className="text-center text-2xl font-medium">
                                    {data.profile.first_name} {data.profile.last_name}
                                </p>
                                <p className="text-center text-base">{data.email}</p>
                                <p className="text-center text-base">
                                    {t("member_since")}{" "}
                                    {new Date(Number(data.created_at)).toDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="grid w-full grid-cols-2 gap-x-8 gap-y-9">
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem className="relative">
                                        <FormLabel className="bg-surface text-muted-foreground absolute -top-2.5 left-3 px-1 text-xs leading-none">
                                            {t("first_name")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                variant="default"
                                                {...field}
                                                size="default"
                                                className="text-base"
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
                                        <FormLabel className="bg-surface text-muted-foreground absolute -top-2.5 left-3 px-1 text-xs leading-none">
                                            {t("last_name")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                variant="default"
                                                className="text-base"
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
                                        <FormLabel className="bg-surface text-muted-foreground absolute -top-2.5 left-3 px-1 text-xs leading-none">
                                            {t("department")}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="border-border-input-default h-auto rounded-none border px-3 py-4 shadow-none focus:ring-0">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent side="bottom" avoidCollisions={false}>
                                                {Object.values(departments).map((department) => (
                                                    <SelectItem key={department} value={department}>
                                                        {department}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="position_name"
                                render={({ field }) => (
                                    <FormItem className="relative">
                                        <FormLabel className="bg-surface text-muted-foreground absolute -top-2.5 left-3 px-1 text-xs leading-none">
                                            {t("position")}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="border-border-input-default h-auto rounded-none border px-3 py-4 shadow-none focus:ring-0">
                                                    <SelectValue className="" />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent side="bottom" avoidCollisions={false}>
                                                {Object.values(positions).map((position) => (
                                                    <SelectItem key={position} value={position}>
                                                        {position}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <Button
                                className="text-gray-button-text col-start-2"
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                variant="grayBg"
                                size="updateButton"
                            >
                                {t("update")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
