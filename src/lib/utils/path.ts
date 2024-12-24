import { headers } from 'next/headers'
import 'server-only'

export const getServerPathname = async () => {
  const headersList = await headers()
  const origin = headersList.get('origin') || ''
  const referer = headersList.get('referer') || ''
  const path = referer.replace(origin, '')

  if (path) {
    return path
  }

  // Return root path if no referer is found
  return '/'
}

export const getBreadcrumbsFromPath = (pathname: string) => {
  const cleanPath = pathname.replace(/^https?:\/\/[^/]+/, '')
  const allSegments = cleanPath.split('/').filter(Boolean)
  const locale = allSegments[0] // Store locale for href generation

  const segments = allSegments.filter(
    (segment, index) =>
      !segment.startsWith('[') && !segment.startsWith('(') && index !== 0
  )

  return segments.map((segment, index) => {
    const href = '/' + [locale, ...segments.slice(0, index + 1)].join('/')
    const label = segment.charAt(0).toUpperCase() + segment.slice(1)

    return {
      href,
      label,
      isLast: index === segments.length - 1,
    }
  })
}
