/**
 * Extract initials from a name string
 * @param name - The full name to extract initials from
 * @returns Two letter initials in uppercase, or '??' if no name provided
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return '??'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
