import { User } from '@prisma/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Globe, Mail, Pencil } from 'lucide-react'
import Link from 'next/link'
import { useFormatter, useTranslations } from 'next-intl'

interface ProfileViewProps {
  user: User
}

export function ProfileView({ user }: ProfileViewProps) {
  const t = useTranslations('profile')
  const format = useFormatter()

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="flex-row items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={(user.userImage || user.image) ?? undefined}
            alt={user.name || ''}
          />
          <AvatarFallback>{user.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-col-reverse items-center justify-between gap-4 md:flex-row">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile/edit">
                <Pencil className="mr-2 h-4 w-4" />
                {t('edit')}
              </Link>
            </Button>
          </div>
          {user.bio && <p className="mt-1 text-muted-foreground">{user.bio}</p>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
          {user.website && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-4 w-4" />
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {user.website}
              </a>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {t('joined')}{' '}
              {format.dateTime(new Date(user.createdAt), {
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
