import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
// import createIntlMiddleware from 'next-intl/middleware'
// import { locales } from '../i18n/request'

// Create the internationalization middleware
// const intlMiddleware = createIntlMiddleware({
//   locales,
//   defaultLocale: 'en',
// })

const isPublicRoute = createRouteMatcher(['/:locale/auth/login', '/api/:path*'])

export default clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url)
  const locale = url.pathname.split('/')[1] || 'en'

  if (!isPublicRoute(request)) {
    await auth.protect({
      unauthenticatedUrl: `${url.origin}/${locale}/auth/login`,
    })
  }
  // return intlMiddleware(request)
})

// export default clerkMiddleware(async (auth, request) => {
//   if (!isPublicRoute(request)) {
//     await auth.protect()
//   }
// })

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
