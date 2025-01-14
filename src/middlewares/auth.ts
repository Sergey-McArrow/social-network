import { NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export const shouldSkipMiddleware = (req: NextRequest) => {
  return (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  )
}
