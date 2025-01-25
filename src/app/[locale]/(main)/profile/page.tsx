import { prisma } from '@/prisma'
import { ProfileView } from '@/components/profile/profile-view'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type TProfilePageProps = {
  params: { locale: string }
}

const ProfilePage: React.FC<TProfilePageProps> = async ({ params }) => {
  const user = await currentUser()

  if (!user?.emailAddresses?.[0]?.emailAddress) {
    redirect(`/${params.locale}/auth/login`)
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
  })

  if (!dbUser) {
    redirect(`/${params.locale}/auth/login`)
  }

  return (
    <div className="container mx-auto p-4">
      <ProfileView user={dbUser} />
    </div>
  )
}

export default ProfilePage
