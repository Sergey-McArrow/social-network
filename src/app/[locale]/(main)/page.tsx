import { postQuery } from '@/prisma/query'
import { prisma } from '@/prisma'
import { PostCard } from '@/components/ui/post-card'
const HomePage = async () => {
  const posts = await prisma.post.findMany({
    ...postQuery,
  })
  return (
    <section className="mx-auto space-y-4 p-4">
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </section>
  )
}

export default HomePage
