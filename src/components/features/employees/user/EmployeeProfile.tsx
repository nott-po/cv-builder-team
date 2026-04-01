import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { EmployeeAvatar } from "@/components/shared/EmployeeAvatar";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserData } from "@/lib/hooks/useUserData";

export function EmployeeProfile() {
    const params = useParams();
    const employeeId = params?.id as string;
    const { data, isLoading, isError } = useUserData(employeeId);
    const t = useTranslations("User");

    if ((!isLoading && !data) || isError) {
        return <ErrorMessage message={t("error")} />;
    }

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-213 p-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
                        <Skeleton className="mb-2 h-30 w-30 rounded-full" />
                        <div className="flex flex-col gap-1">
                            <Skeleton className="mx-auto mb-2 h-6 w-50" />
                            <Skeleton className="mx-auto h-6 w-30" />
                            <Skeleton className="mx-auto h-6 w-40" />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
                        <EmployeeAvatar
                            size="xl"
                            avatar={data?.profile.avatar}
                            initial={(
                                data?.profile?.first_name?.[0] ??
                                data?.email?.[0] ??
                                "?"
                            ).toUpperCase()}
                        />
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
