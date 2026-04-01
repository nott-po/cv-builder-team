import { createAuthHandler } from "../handle-auth";
import { SIGNUP_MUTATION } from "@/lib/graphql/operations/auth";

export const POST = createAuthHandler({
    query: SIGNUP_MUTATION,
    resultKey: "signup",
    errorStatus: 400,
});
