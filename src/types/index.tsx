import { TClerkUser } from './TClerkUser'

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

export interface TUserStatus {
  status: 'online' | 'offline'
  lastSeen: string
}

export interface TUserWithStatus extends TClerkUser, TUserStatus {}

export interface TUserListProps {
  users: TUserWithStatus[]
  currentUserId?: string
  onSelectUser: (user: TClerkUser) => void
  loading?: boolean
}
