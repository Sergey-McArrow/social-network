import createMiddleware from 'next-intl/middleware'
import { handleAuthRedirect } from './middlewares/auth'
import { locales } from './i18n'
import { NextResponse, NextRequest } from 'next/server'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'never',
})

export default async function middleware(request: NextRequest) {
  const intlResponse = await intlMiddleware(request)

  if (intlResponse instanceof NextResponse) {
    return intlResponse
  }

  const authResponse = await handleAuthRedirect(request)
  if (authResponse) {
    return authResponse
  }

  return intlResponse
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
