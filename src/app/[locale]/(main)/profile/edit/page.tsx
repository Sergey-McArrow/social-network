import { EditForm } from '@/components/profile/edit-profile-form'
import { getTranslations } from 'next-intl/server'
import { currentUser } from '@clerk/nextjs'
import { prisma } from '@/prisma'
import { redirect } from 'next/navigation'

type TEditPageProps = {
  params: { locale: string }
}

const EditPage: React.FC<TEditPageProps> = async ({ params }) => {
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

  const t = await getTranslations('profile')

  return (
    <section className="mx-auto space-y-4 p-4">
      <h2>{t('edit')}</h2>
      <EditForm user={dbUser} />
    </section>
  )
}

export default EditPage
