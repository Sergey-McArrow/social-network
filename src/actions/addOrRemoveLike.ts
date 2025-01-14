'use server'

import { auth } from '@/auth'
import { prisma } from '@/prisma'
import { revalidatePath } from 'next/cache'
export const addOrRemoveLikeAction = async (
  prevState: { message: string; data?: unknown },
  formData: FormData
) => {
  try {
    const postId = formData.get('postId') as string
    const session = await auth()
    if (!session?.user?.id) throw new Error('User not authenticated')
    if (!postId) throw new Error('Post not found')

    const liked = formData.get('liked') === 'true'
    console.log({ liked })

    if (!liked) {
      await prisma.post.update({
        where: { id: postId },
        data: {
          likes: {
            create: {
              authorId: session.user.id,
            },
          },
        },
      })
    } else {
      await prisma.like.deleteMany({
        where: {
          AND: [{ postId }, { authorId: session.user.id }],
        },
      })
    }

    revalidatePath(`/[locale]/(main)`, 'page')
    return { message: 'success', data: { liked: !liked } }
  } catch (error) {
    console.error(error)
    return {
      message:
        'Error: ' + (error instanceof Error ? error.message : String(error)),
      data: prevState,
    }
  }
}
