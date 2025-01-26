import { postQuery } from '@/prisma/query'
import { prisma } from '@/prisma'
import { PostCard } from '@/components/ui/post-card'
// import { auth } from '@/auth'

const HomePage = async () => {
  // const session = await auth()
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    ...postQuery,
  })

  return (
    <section className="mx-auto space-y-4 p-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </section>
  )
}

export default HomePage
