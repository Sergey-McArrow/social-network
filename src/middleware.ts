import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

export const middleware = async (req: NextRequest) => {
  const session = await auth()
  const isLoggedIn = !!session?.user
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
  console.log({ session })

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
    return NextResponse.next()
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl))
  }

  return NextResponse.next()
}

export default middleware
