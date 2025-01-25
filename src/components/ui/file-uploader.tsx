import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dispatch, FC, JSX, SetStateAction, SVGProps } from 'react'
import { uploadPostImage } from '@/actions/uploadPostImage'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

type TFileUploaderProps = {
  setImageUrl: Dispatch<SetStateAction<string | null>>
}

export const FileUploader: FC<TFileUploaderProps> = ({ setImageUrl }) => {
  const { user } = useUser()
  const t = useTranslations('addPost')
  
  if (!user) return null

  return (
    <form
      action={async (formData: FormData) => {
        const res = await uploadPostImage(formData)
        if (res?.error) {
          toast.error(res.error)
        }
        setImageUrl(res.url)
        toast.success(t('imageUploaded'))
      }}
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col items-center gap-1 rounded-lg border-2 border-dashed border-gray-200 p-6">
            <FileIcon className="h-10 w-10 fill-current" />
            <Label htmlFor="picture" className="text-sm font-medium">
              {t('dragAndDrop')}
            </Label>
            <p className="text-xs text-muted-foreground">{t('imageTypes')}</p>
          </div>
          <Input
            id="picture"
            type="file"
            name="image"
            accept="image/*"
            className="cursor-pointer"
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            {t('upload')}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

function FileIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}
