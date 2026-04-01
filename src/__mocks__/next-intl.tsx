import { ReactNode } from "react";

export const NextIntlClientProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
export const useTranslations = () => (key: string) => key;
export const useLocale = () => "en";
export const useMessages = () => ({});
export const useFormatter = () => ({});
