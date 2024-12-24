import { auth } from '@/auth'
import { prisma } from '@/prisma'
import { EditForm } from './edit-form'
import { getTranslations } from 'next-intl/server'

const EditPage = async () => {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  })
  const t = await getTranslations('profile')

  return (
    <section className='space-y-4 p-4 mx-auto'>
      <h2>{t('edit')}</h2>
      <EditForm user={user} />
    </section>
  )
}

export default EditPage
