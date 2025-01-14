import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { locales } from '../i18n/request'
import { auth } from './auth'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
})

const PUBLIC_PATHS = ['/auth', '/api/auth']

async function middleware(request: NextRequest) {
  // Skip middleware for API and auth routes
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const session = await auth()
  const isLoggedIn = !!session?.user
  const pathname = request.nextUrl.pathname
  const locale = pathname.split('/')[1] || 'en'
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '')

  if (PUBLIC_PATHS.some((path) => pathnameWithoutLocale.startsWith(path))) {
    return intlMiddleware(request)
  }

  if (!isLoggedIn) {
    const loginUrl = new URL(`/${locale}/auth/login`, request.url)
    loginUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return intlMiddleware(request)
}

export default middleware

export const config = {
  matcher: ['/((?!_next|.*\\.|api/auth/callback).*)', '/', '/(en|ru)/:path*'],
}
