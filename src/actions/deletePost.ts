'use server'

import { auth } from '@/auth'
import { z } from 'zod'
import { prisma } from '@/prisma'
import { revalidatePath } from 'next/cache'
import { TSimpleActionState } from '@/types/action'

const DeletePostSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
})

export async function deletePostAction(
  _prevState: TSimpleActionState | null,
  formData: FormData
) {
  try {
    const session = await auth()

    const validatedFields = DeletePostSchema.parse({
      postId: formData.get('postId'),
    })

    if (!session?.user?.id) {
      return {
        error: 'User not authenticated',
      }
    }

    // Check if the post exists and belongs to the user
    const post = await prisma.post.findUnique({
      where: {
        id: validatedFields.postId,
      },
    })

    if (!post) {
      return {
        error: 'Post not found',
      }
    }

    if (post.authorId !== session.user.id) {
      return {
        error: 'Not authorized to delete this post',
      }
    }

    await prisma.post.delete({
      where: {
        id: validatedFields.postId,
      },
    })

    revalidatePath('/')
    return {
      message: 'success',
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: JSON.stringify(error.flatten().fieldErrors, null, 2),
      }
    }

    return {
      error: 'Something went wrong' + JSON.stringify(error, null, 2),
    }
  }
}
