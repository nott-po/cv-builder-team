import { AUTH_RESULT_FIELDS } from "../fragments/auth";

export const LOGIN_QUERY = `
    query Login($auth: AuthInput!) {
        login(auth: $auth) { ${AUTH_RESULT_FIELDS} }
    }
`;

export const SIGNUP_MUTATION = `
    mutation Signup($auth: AuthInput!) {
        signup(auth: $auth) { ${AUTH_RESULT_FIELDS} }
    }
`;

export const REFRESH_MUTATION = `
    mutation UpdateToken {
        updateToken {
            access_token
            refresh_token
        }
    }
`;
