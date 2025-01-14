import { FC } from 'react'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TMessageItemProps } from '@/types'

export const MessageItem: FC<TMessageItemProps> = ({
  message,
  isCurrentUser,
  userImage,
  partnerImage,
}) => {
  const t = useTranslations('messages')

  return (
    <div
      className={`flex items-center gap-4 ${
        isCurrentUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <Avatar>
        <AvatarImage
          src={isCurrentUser ? userImage ?? undefined : partnerImage ?? undefined}
          alt={`${isCurrentUser ? t('you') : t('partner')}'s avatar`}
        />
        <AvatarFallback>
          {isCurrentUser ? t('you') : t('partner')}
        </AvatarFallback>
      </Avatar>
      <p className="text-lg">{message.message}</p>
      <span className="text-xs text-muted-foreground">
        {new Date(message.timestamp).toLocaleString()}
      </span>
    </div>
  )
}
