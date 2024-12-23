import createMiddleware from 'next-intl/middleware'
import { handleAuthRedirect } from './middlewares/auth'
import { locales } from './i18n'
import { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'never',
})

export default async function middleware(request: NextRequest) {
  const authResponse = await handleAuthRedirect(request)
  if (authResponse) {
    return authResponse
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
