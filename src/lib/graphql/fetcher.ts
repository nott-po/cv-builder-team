import { GraphQLClient } from "graphql-request";

const BASE_URL =
    typeof window !== "undefined"
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");

export const gqlClient = new GraphQLClient(`${BASE_URL}/api/graphql`);
