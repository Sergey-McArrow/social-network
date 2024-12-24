import { auth } from '@/auth'
import { prisma } from '@/prisma'
import { ProfileView } from '@/components/profile/profile-view'
import { redirect } from 'next/navigation'

const ProfilePage = async () => {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
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
