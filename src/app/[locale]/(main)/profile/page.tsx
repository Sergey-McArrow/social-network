import { auth } from '@/auth'

const ProfilePage = async () => {
  const user = await auth()
  return <pre>{JSON.stringify(user, null, 2)}</pre>
}

export default ProfilePage
