"use client";

import { useQuery } from "@tanstack/react-query";

import { fetcher } from "@/lib/graphql/fetcher";
import { USER_QUERY } from "@/lib/graphql/operations/employee";

export type EmployeeDetails = {
    id: string;
    email: string;
    created_at: string;
    department_name: string | null;
    department?: { id: string } | null;
    position_name: string | null;
    position?: { id: string } | null;
    profile: {
        first_name: string | null;
        last_name: string | null;
        avatar: string | null;
    };
};

export type UserQueryResponse = {
    user: EmployeeDetails;
};

export function useUserData(id: string) {
    return useQuery<UserQueryResponse, Error, EmployeeDetails>({
        queryKey: ["employee", id],
        queryFn: () => fetcher<UserQueryResponse, { userId: string }>(USER_QUERY, { userId: id })(),
        select: (data) => data.user,
        enabled: Boolean(id),
    });
}
