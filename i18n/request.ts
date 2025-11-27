import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

const isSupportedLocale = (
  value: unknown,
): value is (typeof routing.locales)[number] =>
  typeof value === 'string' &&
  routing.locales.some((supportedLocale) => supportedLocale === value)

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  const locale = await requestLocale
  const resolvedLocale = isSupportedLocale(locale)
    ? locale
    : routing.defaultLocale

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
    timeZone: 'UTC',
  }
})
