import { GraphQLClient } from "graphql-request";

const BASE_URL =
    typeof window !== "undefined"
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");

export const gqlClient = new GraphQLClient(`${BASE_URL}/api/graphql`);

export function fetcher<TData, TVariables extends Record<string, unknown>>(
    query: string,
    variables?: TVariables,
) {
    return () => gqlClient.request<TData>(query, variables as Record<string, unknown>);
}
