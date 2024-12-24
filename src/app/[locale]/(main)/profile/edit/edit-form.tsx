'use client'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { getInitials } from '@/lib/utils/helpers'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { updateProfile } from './actions'
import type { User } from '@prisma/client'
import { useActionState } from 'react'
import { useTranslations } from 'next-intl'
import { useState, useTransition, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type EditFormProps = {
  user: User | null
}

export function EditForm({ user }: EditFormProps) {
  const [state, formAction] = useActionState(updateProfile, null)
  const [isPending, startTransition] = useTransition()
  const t = useTranslations('profile')
  const router = useRouter()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (state?.message) {
      toast.success(state.message)
      router.push('/profile')
    }
    if (state?.errors?._form) {
      toast.error(state.errors._form.join(', '))
    }
    if (state?.errors?.userImage) {
      toast.error(state.errors.userImage.join(', '))
    }
  }, [state, router])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-8">
      <div className="flex items-center gap-8">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={previewUrl ?? user?.userImage ?? user?.image ?? undefined}
            alt={user?.name ?? t('avatar')}
          />
          <AvatarFallback className="text-lg">
            {getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="avatar">{t('changeAvatar')}</Label>
          <Input
            id="avatar"
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={isPending}
          />
          {state?.errors?.userImage && (
            <p className="text-sm text-destructive">
              {state.errors.userImage.join(', ')}
            </p>
          )}
        </div>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="username">{t('username')}</Label>
        <Input
          id="username"
          name="username"
          defaultValue={user?.name ?? ''}
          placeholder={t('usernamePlaceholder')}
          required
          minLength={3}
          disabled={isPending}
        />
        {state?.errors?.name && (
          <p className="text-sm text-destructive">
            {state.errors.name.join(', ')}
          </p>
        )}
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="website">{t('website')}</Label>
        <Input
          id="website"
          name="website"
          type="url"
          placeholder="https://tailbook.me"
          defaultValue={user?.website ?? ''}
          pattern="https://.*"
          disabled={isPending}
        />
        {state?.errors?.website && (
          <p className="text-sm text-destructive">
            {state.errors.website.join(', ')}
          </p>
        )}
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="about">{t('about')}</Label>
        <Input
          id="about"
          name="about"
          placeholder={t('aboutPlaceholder')}
          defaultValue={user?.bio ?? ''}
          disabled={isPending}
        />
        {state?.errors?.bio && (
          <p className="text-sm text-destructive">
            {state.errors.bio.join(', ')}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          type="button"
          formAction="/profile"
          disabled={isPending}
        >
          {t('cancel')}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('save')}
        </Button>
      </div>
    </form>
  )
}
