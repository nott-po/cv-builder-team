import axios, { AxiosError } from "axios";

const backendClient = axios.create({
    baseURL: process.env.GRAPHQL_URL ?? "http://localhost:3001/api/graphql",
    headers: { "Content-Type": "application/json" },
});

export type GqlError = { message: string; extensions?: { code?: string } };

export type GqlResponse<TData = Record<string, unknown>> = {
    data?: TData;
    errors?: GqlError[];
};

export async function gqlRequest<TData = Record<string, unknown>>(
    body: { query: string; variables?: Record<string, unknown> },
    bearerToken?: string,
): Promise<{ status: number; data: GqlResponse<TData> }> {
    try {
        const headers: Record<string, string> = {};
        if (bearerToken) {
            headers["Authorization"] = `Bearer ${bearerToken}`;
        }
        const response = await backendClient.post<GqlResponse<TData>>("", body, { headers });
        return { status: response.status, data: response.data };
    } catch (err) {
        if (err instanceof AxiosError && err.response) {
            return { status: err.response.status, data: err.response.data };
        }
        throw err;
    }
}

export default backendClient;
