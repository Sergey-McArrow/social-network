import { EditForm } from '@/components/profile/edit-profile-form'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/auth'
import { prisma } from '@/prisma'

const EditPage = async () => {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email || '',
    },
  })
  const t = await getTranslations('profile')

  return (
    <section className="mx-auto space-y-4 p-4">
      <h2>{t('edit')}</h2>
      <EditForm user={user} />
    </section>
  )
}

export default EditPage
