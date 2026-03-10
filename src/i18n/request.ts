import {getRequestConfig} from "next-intl/server";

export default getRequestConfig(async ({requestLocale}) => {
  const locale = (await requestLocale) || "en";
  let messages;

  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load ${locale} messages:`, error);
    const fallbackMessages = await import(`@/messages/en.json`);
    messages = fallbackMessages.default;
  }

  return {
    locale,
    messages,
    timeZone: 'UTC'
  };
});
