import { enUS, ruRU } from '@clerk/localizations'

/**
 * Extract initials from a name string
 * @param name - The full name to extract initials from
 * @returns Two letter initials in uppercase, or '??' if no name provided
 */
export const getInitials = (name: string | null | undefined) => {
  if (!name) return 'NN'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }

  return date.toLocaleDateString('en-GB', options)
}

export const getLocalization = (locale: string) => {
  switch (locale) {
    case 'en':
      return enUS
    case 'ru':
      return ruRU
    default:
      return enUS
  }
}
