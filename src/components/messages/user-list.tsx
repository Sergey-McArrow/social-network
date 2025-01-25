import { FC } from 'react'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '../ui/skeleton'
import { TUserListProps, TUserWithStatus } from '@/types'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

export const UserList: FC<TUserListProps> = ({
  users,
  currentUserId,
  onSelectUser,
  loading,
}) => {
  const t = useTranslations('messages')

  if (loading) {
    return (
      <div className="space-y-2">
        <h2 className="mb-4 text-lg font-semibold">{t('contacts')}</h2>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const filteredUsers = users.filter((user) => user.id !== currentUserId)

  return (
    <div className="space-y-2">
      <h2 className="mb-4 text-lg font-semibold">{t('contacts')}</h2>
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user: TUserWithStatus) => (
          <TooltipProvider key={user.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-start space-x-4 p-2"
                  onClick={() => onSelectUser(user)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={user.imageUrl} alt={user.firstName || ''} />
                      <AvatarFallback>
                        {user.firstName?.[0]?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                        user.status === 'online'
                          ? 'bg-green-500'
                          : 'bg-gray-500'
                      }`}
                    />
                  </div>
                  <span className="truncate">
                    {user.firstName} {user.lastName}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {user.status === 'online'
                    ? t('online')
                    : t('lastSeen', { time: new Date(user.lastSeen) })}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))
      ) : (
        <p className="text-center text-muted-foreground">{t('noUsers')}</p>
      )}
    </div>
  )
}
