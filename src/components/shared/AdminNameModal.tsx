"use client";

import { useTranslations } from "next-intl";

import { SimpleNameForm, type SimpleNameFormData } from "@/components/shared/SimpleNameForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useModalMutation } from "@/lib/hooks/useModalMutation";

interface AdminNameModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    errorMessage: string;
    /** Omit for create mode. Pass `null` while no entity is selected in edit mode. */
    entity?: { id: string; name: string } | null;
    mutationFn: (data: SimpleNameFormData) => Promise<unknown>;
    onSuccess: () => void;
}

export function AdminNameModal({
    open,
    onOpenChange,
    title,
    errorMessage,
    entity,
    mutationFn,
    onSuccess,
}: AdminNameModalProps) {
    const t = useTranslations("Admin");

    const { isPending, submitError, handleOpenChange, handleMutate } = useModalMutation({
        mutationFn,
        onSuccess,
        onClose: onOpenChange,
    });

    const isEditing = entity !== undefined;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-full max-w-[calc(100vw-2rem)] sm:max-w-lg"
                aria-describedby={undefined}
            >
                <DialogTitle>{title}</DialogTitle>
                {(!isEditing || entity) && (
                    <SimpleNameForm
                        key={entity?.id ?? "create"}
                        submitLabel={isEditing ? t("save") : t("create")}
                        initialData={entity ? { name: entity.name } : undefined}
                        onSubmit={(data) => handleMutate(data, errorMessage)}
                        onCancel={() => handleOpenChange(false)}
                        isSubmitting={isPending}
                        error={submitError}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
