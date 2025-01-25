export type TClerkUser = {
  id: string
  firstName?: string | null
  fullName?: string | null
  lastName?: string | null
  imageUrl: string
  emailAddresses: { emailAddress: string }[]
  hasImage: boolean
}
