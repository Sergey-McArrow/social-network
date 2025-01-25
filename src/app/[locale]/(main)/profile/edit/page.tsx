import { EditForm } from '@/components/profile/edit-profile-form'
import { getTranslations } from 'next-intl/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/prisma'
import { redirect } from 'next/navigation'

type TEditPageProps = {
  params: Promise<{ locale: string }>
}

const EditPage: React.FC<TEditPageProps> = async ({ params }) => {
  const { locale } = await params

  const user = await currentUser()

  if (!user?.emailAddresses?.[0]?.emailAddress) {
    redirect(`/${locale}/auth/login`)
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
  })

  if (!dbUser) {
    redirect(`/${locale}/auth/login`)
  }

  const t = await getTranslations('profile')

  return (
    <section className="mx-auto space-y-4 p-4">
      <h2>{t('edit')}</h2>
      <EditForm user={dbUser} />
    </section>
  )
}

export default EditPage
