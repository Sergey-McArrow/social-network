import { auth } from '@/auth'
import { prisma } from '@/prisma'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { getInitials } from '@/lib/utils/helpers'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const EditPage = async () => {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  })
  return (
    <section className='space-y-4 p-4 mx-auto'>
      <h2>Edit Profile</h2>
      <div className='flex items-center gap-8'>
        <Avatar>
          <AvatarImage
            src={user?.image ?? undefined}
            alt={user?.name ?? 'User avatar'}
          />
          <AvatarFallback className='rounded-lg p-1'>
            {getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label htmlFor='avatar'>Change avatar</Label>
          <Input id='avatar' type='file' />
        </div>
      </div>
    </section>
  )
}

export default EditPage
