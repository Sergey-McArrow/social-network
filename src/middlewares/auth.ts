import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../auth'

const PUBLIC_FILE = /\.(.*)$/

export const shouldSkipMiddleware = (req: NextRequest) => {
  return (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  )
}

export const handleAuthRedirect = async (req: NextRequest) => {
  if (shouldSkipMiddleware(req)) {
    return
  }

  const session = await auth()
  const isLoggedIn = !!session?.user
  const isAuthPage = req.nextUrl.pathname.includes('/auth/')

  // Extract locale from the pathname
  const locale = req.nextUrl.pathname.split('/')[1] || 'en'

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(`/${locale}`, req.url))
    }
  } else if (!isLoggedIn) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url))
  }
}
