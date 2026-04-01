import { createAuthHandler } from "../handle-auth";
import { LOGIN_QUERY } from "@/lib/graphql/operations/auth";

export const POST = createAuthHandler({
    query: LOGIN_QUERY,
    resultKey: "login",
    errorStatus: 401,
});
