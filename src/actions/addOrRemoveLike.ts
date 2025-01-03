'use server'

import { auth } from '@/auth'
import { prisma } from '@/prisma'
import { revalidatePath } from 'next/cache'
export const addOrRemoveLikeAction = async (
  _prevState: unknown,
  formData: FormData
) => {
  try {
    const postId = formData.get('postId') as string
    const session = await auth()
    if (!session) throw new Error('User not authenticated')
    if (!postId) throw new Error('Post not found')
    const liked = formData.get('liked') === 'true'

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
      await prisma.like.delete({
        where: { authorId_postId: { authorId: session.user.id, postId } },
      })
    }

    revalidatePath(`/[locale]/(main)`, 'page')
    return {
      message: 'success',
      data: _prevState,
    }
  } catch (error) {
    console.error(error)
    return {
      message: 'Error:' + (error instanceof Error ? error.message : error),
    }
  }
}
