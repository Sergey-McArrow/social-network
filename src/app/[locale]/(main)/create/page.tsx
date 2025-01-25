import { currentUser } from '@clerk/nextjs'
import { AddPostDialog } from '@/components/ui/add-post-dialog'
import { PostCard } from '@/components/ui/post-card'
import { prisma } from '@/prisma'
import { postQuery } from '@/prisma/query'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

type TCreatePageProps = {
  params: { locale: string }
}

const CreatePage: React.FC<TCreatePageProps> = async ({ params }) => {
  const user = await currentUser()
  
  if (!user) {
    redirect(`/${params.locale}/auth/login`)
  }

  const t = await getTranslations('Post')
  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
    ...postQuery,
  })

  return (
    <section className="mx-auto space-y-4 p-4">
      <AddPostDialog />
      <h2 className="text-center text-2xl font-bold">{t('yourPost')}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </section>
  )
}

export default CreatePage
