import { clerkMiddleware } from '@clerk/nextjs/server'
import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'

const intlMiddleware = createMiddleware({
  locales: ['en', 'ru'],
  defaultLocale: 'en',
})

// Public paths that don't require authentication
const publicPaths = [
  '/sso-callback',
  '/api/webhooks',
  '/api/webhooks/(.*)',
  '/auth/login',
  '/auth/signup',
  '/auth/reset-password',
  '/:locale/auth/login',
  '/:locale/auth/signup',
  '/:locale/auth/reset-password',
]

const isPublicPath = (pathname: string) => {
  return publicPaths.some(path => {
    if (path.includes(':locale')) {
      const pattern = path.replace(':locale', '(en|ru)')
      return new RegExp(`^${pattern}($|/)`).test(pathname)
    }
    return pathname === path || pathname.startsWith(`${path}/`)
  })
}

const isPublicRoute = (request: Request) => {
  const url = new URL(request.url)
  return (
    isPublicPath(url.pathname) ||
    url.pathname.startsWith('/api/') ||
    url.searchParams.has('__clerk_db_jwt')
  )
}

export default clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url)

  // Skip middleware for API routes and special paths
  if (url.pathname.startsWith('/api/') || 
      url.pathname === '/sso-callback' || 
      url.searchParams.has('__clerk_db_jwt')) {
    return NextResponse.next()
  }

  const locale = url.pathname.split('/')[1]
  const isLocalePresent = ['en', 'ru'].includes(locale)

  // Add locale prefix if missing
  if (!isLocalePresent && !url.pathname.startsWith('/api/')) {
    const newUrl = new URL(request.url)
    newUrl.pathname = `/en${url.pathname}`
    return NextResponse.redirect(newUrl)
  }

  // Handle authentication
  if (!isPublicRoute(request)) {
    await auth.protect({
      unauthenticatedUrl: new URL('/en/auth/login', request.url).toString(),
    })
  }

  return intlMiddleware(request)
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
