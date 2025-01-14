import { FC } from 'react'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { TUserListProps } from '@/types'

export const UserList: FC<TUserListProps> = ({
  users,
  currentUserId,
  onSelectUser,
}) => {
  const t = useTranslations('messages')

  return (
    <div className="col-span-1 rounded-lg bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">{t('conversations')}</h2>
      <div className="space-y-2">
        {users.map((user) => {
          if (user.id === currentUserId) return null
          return (
            <Button
              key={user.id}
              variant="ghost"
              onClick={() => onSelectUser(user)}
              className="space-x-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={user.name ?? t('partner')}
                />
                <AvatarFallback>{user.name?.[0] ?? '?'}</AvatarFallback>
              </Avatar>
              <span>{user.name}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
