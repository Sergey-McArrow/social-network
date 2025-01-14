import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { locales } from '../i18n/request'
import { auth } from './auth'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
})

const PUBLIC_PATHS = ['/auth/login', '/auth/error']

async function middleware(request: NextRequest) {
  const session = await auth()
  const isLoggedIn = !!session?.user
  const pathname = request.nextUrl.pathname
  const locale = pathname.split('/')[1] || 'en'
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '')

  if (PUBLIC_PATHS.some((path) => pathnameWithoutLocale.startsWith(path))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
    }
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
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/', '/(en|ru)/:path*'],
}
