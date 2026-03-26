"use client";

import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { UserCVHeader } from "@/components/features/cvs/UserCVHeader";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { PageHeader } from "@/components/shared/PageHeader";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useCv } from "@/lib/hooks/useCV";
import { useUpdateCV } from "@/lib/hooks/useUpdateCV";
import { cn } from "@/lib/utils";

const cvSchema = z.object({
    name: z.string().min(1, "Name is required"),
    education: z.string().optional(),
    description: z.string().optional(),
});

export type UpdateCvFormData = z.infer<typeof cvSchema>;

export function CVUpdateForm() {
    const params = useParams();
    const cvId = params.id as string;
    const t = useTranslations("CV");

    const { user } = useCurrentUser();
    const isAdmin = user?.role === "Admin";

    const { cv, isLoading: isFetching, isError: isFetchError } = useCv(cvId);

    const { mutateAsync: updateCv, isPending: isSubmitting, error: updateError } = useUpdateCV();

    const form = useForm<UpdateCvFormData>({
        resolver: zodResolver(cvSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            education: "",
            description: "",
        },
        values: cv
            ? {
                  name: cv.name,
                  education: cv.education || "",
                  description: cv.description || "",
              }
            : undefined,
    });

    const { isDirty, isValid } = form.formState;
    const isSubmitEnabled = isDirty && isValid;

    const onSubmit = async (data: UpdateCvFormData) => {
        try {
            await updateCv({
                cvId: cvId,
                ...data,
            });
        } catch (e) {
            console.error("Failed to update CV", e);
        }
    };

    if (isFetchError) return <ErrorMessage message={t("error")} />;

    if (isFetching || !cv) {
        return (
            <div>
                <div className="flex justify-start gap-3 px-11 pt-3 pb-3">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="mb-4 px-6">
                    <div className="mb-4">
                        <UserCVHeader mode="details" />
                    </div>
                    <div className="mx-auto max-w-213 space-y-9 pt-4">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-40 w-full" />
                        <div className="flex justify-end">
                            <Skeleton className="h-12 w-full md:w-1/2" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                items={[
                    { label: t("cvs"), href: `${isAdmin ? "/admin" : ""}/cvs` },
                    { label: cv.name },
                ]}
            />

            <div className="mb-4 px-6">
                <div className="mb-8">
                    <UserCVHeader mode="details" isAdmin={isAdmin} />
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mx-auto flex max-w-213 flex-col gap-9 pt-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <FormItem className="relative">
                                    <FormLabel className="bg-surface text-muted-foreground absolute -top-2.5 left-3 z-10 px-1 text-xs leading-none">
                                        {t("name")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            variant={
                                                fieldState.error || form.formState.errors.root
                                                    ? "error"
                                                    : "default"
                                            }
                                            size="default"
                                            className="relative z-0 text-base"
                                            autoComplete="off"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="education"
                            render={({ field, fieldState }) => (
                                <FormItem className="relative">
                                    <FormLabel className="bg-surface text-muted-foreground absolute -top-2.5 left-3 z-10 px-1 text-xs leading-none">
                                        {t("education")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            variant={
                                                fieldState.error || form.formState.errors.root
                                                    ? "error"
                                                    : "default"
                                            }
                                            size="default"
                                            className="relative z-0 text-base"
                                            autoComplete="off"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="relative">
                                    <FormLabel className="bg-surface text-muted-foreground absolute -top-2.5 left-3 z-10 px-1 text-xs leading-none">
                                        {t("description")}
                                    </FormLabel>
                                    <FormControl>
                                        <textarea
                                            className={cn(
                                                "border-border-input-default text-input-default flex w-full rounded-none border bg-transparent px-3 py-4 text-base shadow-none transition-colors",
                                                "min-h-[160px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
                                                "relative z-0",
                                            )}
                                            autoComplete="off"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {updateError && (
                            <p className="text-destructive text-sm">
                                {updateError instanceof Error ? updateError.message : t("error")}
                            </p>
                        )}

                        <div className="flex w-full justify-end gap-3">
                            <Button
                                className="w-full md:w-1/2"
                                type="submit"
                                disabled={isSubmitting || !isSubmitEnabled}
                                variant={isSubmitting || !isSubmitEnabled ? "grayBg" : "redPrimary"}
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
