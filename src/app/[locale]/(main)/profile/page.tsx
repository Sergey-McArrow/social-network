import { prisma } from '@/prisma'
import { ProfileView } from '@/components/profile/profile-view'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type TProfilePageProps = {
  params: Promise<{ locale: string }>
}

const ProfilePage: React.FC<TProfilePageProps> = async ({ params }) => {
  const { locale } = await params
  const user = await currentUser()
  const session = await auth()

  console.log({ user })
  console.log({ session })

  if (!user?.emailAddresses?.[0]?.emailAddress) {
    // redirect(`/${params.locale}/auth/login`)
    return null
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
  })

  if (!dbUser) {
    redirect(`/${locale}/auth/login`)
  }

  return (
    <div className="container mx-auto p-4">
      <ProfileView user={dbUser} />
    </div>
  )
}

export default ProfilePage
