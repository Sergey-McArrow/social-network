import { User } from 'next-auth'

export interface TChatMessage {
  sender: string
  message: string
  timestamp: string
}

export interface TMessageItemProps {
  message: TChatMessage
  isCurrentUser: boolean
  userImage?: string | null
  partnerImage?: string | null
}

export interface TUserListProps {
  users: User[]
  currentUserId?: string
  onSelectUser: (user: User) => void
}
