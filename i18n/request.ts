import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'

export const locales = ['en', 'ru'] as const
export type Locale = (typeof locales)[number]

export async function getMessages(locale: string) {
  return (await import(`@/locales/${locale}.json`)).default
}

export default getRequestConfig(async () => {
  const now = new Date('2024-12-23T22:26:56+01:00') // Using the provided timestamp
  const headersList = await headers()
  const locale = (headersList.get('x-next-intl-locale') || 'en') as Locale

  if (!locales.includes(locale)) {
    return {
      locale: 'en',
      messages: await getMessages('en'),
      timeZone: 'Europe/London',
      now,
    }
  }

  return {
    locale,
    messages: await getMessages(locale),
    timeZone: 'Europe/London',
    now,
  }
})
