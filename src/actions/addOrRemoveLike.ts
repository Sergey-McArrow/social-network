'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/prisma'
import { revalidatePath } from 'next/cache'

type TActionState = {
  message: string
  data?: unknown
}

export const addOrRemoveLikeAction = async (
  prevState: TActionState,
  formData: FormData
) => {
  try {
    const { userId } = await auth()
    const postId = formData.get('postId') as string

    if (!userId) throw new Error('User not authenticated')
    if (!postId) throw new Error('Post not found')

    const liked = formData.get('liked') === 'true'

    if (!liked) {
      await prisma.post.update({
        where: { id: postId },
        data: {
          likes: {
            create: {
              authorId: userId,
            },
          },
        },
      })
    } else {
      await prisma.like.deleteMany({
        where: {
          postId,
          authorId: userId,
        },
      })
    }

    revalidatePath('/')
    return { message: 'Success' }
  } catch (error) {
    console.error(error)
    return { message: 'Error', error }
  }
}
