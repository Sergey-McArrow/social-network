import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createMiddleware from 'next-intl/middleware'

const intlMiddleware = createMiddleware({
  locales: ['en', 'ru'],
  defaultLocale: 'en',
})

const isPublicRoute = createRouteMatcher(['/:locale/auth/login', '/api/:path*'])

export default clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url)
  const locale = url.pathname.split('/')[1] || 'en'

  if (!isPublicRoute(request)) {
    await auth.protect({
      unauthenticatedUrl: `${url.origin}/${locale}/auth/login`,
      unauthorizedUrl: `${url.origin}/${locale}/auth/login`,
    })
  }

  return intlMiddleware(request)
})

export const config = {
  matcher: [
    '/api/webhooks(.*)',
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
