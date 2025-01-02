'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { FileUploader } from './file-uploader'
import { Textarea } from './textarea'
import { useEffect, useState } from 'react'
import { deleteFile } from '@/lib/gcloud'
import { toast } from 'sonner'
import { addNewPostAction } from '@/actions/addNewPost'
import { useActionState } from 'react'
import { Loader2Icon, Trash2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export const AddPostDialog = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [formstate, formAction, isPending] = useActionState(
    addNewPostAction,
    null
  )
  const t = useTranslations('addPost')

  useEffect(() => {
    if (formstate?.status === 'success') {
      toast.success(t('postCreated'))
      setImageUrl(null)
      setOpen(false)
    } else if (formstate?.status === 'error') {
      const message = formstate.errors
        ? formstate.errors.map((e) => e.message).join(', ')
        : formstate.message
      toast.error(message || t('postCreateError'))
    }
  }, [formstate, t])

  const removeImg = async () => {
    if (!imageUrl) return

    const fileName = imageUrl.split('/').pop()
    try {
      await deleteFile(fileName!, 'images')
      toast.success(t('imageDeleted'))
      setImageUrl(null)
    } catch (error) {
      toast.error(t('imageDeleteError'))
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t('newPost')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('newPost')}</DialogTitle>
          <DialogDescription>{t('createPost')}</DialogDescription>
        </DialogHeader>
        {!imageUrl ? (
          <FileUploader setImageUrl={setImageUrl} />
        ) : (
          <form action={formAction}>
            <div className="flex">
              <Button type="button" onClick={removeImg} className="ml-auto">
                <Trash2Icon />
              </Button>
            </div>
            <Image
              src={imageUrl}
              alt="Preview"
              width={200}
              height={200}
              className="mx-auto my-2 rounded-lg"
            />
            <div className="grid grid-cols-4 items-center gap-4">
              <input type="hidden" value={imageUrl} name="imageUrl" />
              <Label htmlFor="content" className="text-right">
                {t('content')}
              </Label>
              <Textarea
                id="content"
                className="col-span-3"
                name="content"
                required
                defaultValue={formstate?.data?.content}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={!imageUrl || isPending}
                className="mt-2"
              >
                {isPending ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  t('share')
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
