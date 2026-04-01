"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/lib/api/client";
import type { SessionUser } from "@/types/auth";

export const CURRENT_USER_KEY = ["currentUser"] as const;

export async function fetchCurrentUser(): Promise<SessionUser | null> {
    try {
        const { data } = await apiClient.get<{ user: SessionUser }>("/auth/me");
        return data.user ?? null;
    } catch {
        return null;
    }
}

export function useCurrentUser() {
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery<SessionUser | null>({
        queryKey: CURRENT_USER_KEY,
        queryFn: fetchCurrentUser,
        staleTime: Infinity,
        gcTime: Infinity,
        retry: false,
    });

    function setUser(user: SessionUser | null) {
        queryClient.setQueryData(CURRENT_USER_KEY, user);
    }

    function clearUser() {
        queryClient.setQueryData(CURRENT_USER_KEY, null);
    }

    const currentUser = user ?? null;
    const displayName = currentUser?.email ?? "";
    const initial = currentUser?.email?.[0]?.toUpperCase() ?? "?";

    return { user: currentUser, displayName, initial, isLoading, setUser, clearUser };
}
