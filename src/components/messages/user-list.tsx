import { FC } from 'react'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '../ui/skeleton'
import { TUserListProps } from '@/types'
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

  return (
    <div className="space-y-2">
      <h2 className="mb-4 text-lg font-semibold">{t('contacts')}</h2>
      <div className="space-y-1">
        {users.map((user) => {
          if (user.id === currentUserId) return null
          return (
            <TooltipProvider key={user.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={() => onSelectUser(user)}
                    className="relative h-auto w-full space-x-2 py-2 pr-8"
                  >
                    <div className="flex w-full items-center gap-2">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage
                          src={user.image ?? undefined}
                          alt={user.name ?? t('partner')}
                        />
                        <AvatarFallback>{user.name?.[0] ?? '?'}</AvatarFallback>
                      </Avatar>
                      <span className="line-clamp-1 flex-1 text-left">
                        {user.name}
                      </span>
                    </div>
                    {user.status === 'online' && (
                      <span className="absolute right-2 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-green-500 ring-2 ring-background" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {user.status === 'online'
                    ? t('online')
                    : t('lastSeen', {
                        date: new Date(user.lastSeen).toLocaleString(),
                      })}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
    </div>
  )
}
