import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";

function TestProviders({ children }: { children: ReactNode }) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    return (
        <ThemeProvider attribute="class">
            <NextIntlClientProvider locale="en" messages={{}}>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </NextIntlClientProvider>
        </ThemeProvider>
    );
}

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
    render(ui, { wrapper: TestProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
