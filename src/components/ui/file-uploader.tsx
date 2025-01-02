import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dispatch, FC, JSX, SetStateAction, SVGProps } from 'react'
import { uploadPostImage } from '@/actions/uploadPostImage'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

type TFileUploaderProps = {
  setImageUrl: Dispatch<SetStateAction<string | null>>
}

export const FileUploader: FC<TFileUploaderProps> = ({ setImageUrl }) => {
  const { data: session } = useSession()
  const t = useTranslations('addPost')
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
            <FileIcon className="h-12 w-12" />
            <span className="text-sm font-medium text-gray-500">
              {t('dragAndDrop')}
            </span>
            <span className="text-xs text-gray-500">{t('imageType')}</span>
          </div>
          <div className="space-y-2 text-sm">
            <Label htmlFor="file" className="text-sm font-medium">
              {t('file')}
            </Label>
            <Input id="file" name="file" type="file" accept="image/*,video/*" />
            <input
              type="hidden"
              name="userId"
              value={session?.user?.email ?? ''}
            />
          </div>
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
      width="24"
      height="24"
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
