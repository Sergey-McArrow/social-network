import { auth } from '@/auth'
import { prisma } from '@/prisma'
import { ProfileView } from '@/components/profile/profile-view'

const ProfilePage = async () => {
  const session = await auth()
  console.log('Session:', session)
  if (!session?.user?.email) {
    return <div>You must be logged in to view this page.</div>
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user.email || '',
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return (
    <div className="container mx-auto p-4">
      <ProfileView user={user} />
    </div>
  )
}

export default ProfilePage
