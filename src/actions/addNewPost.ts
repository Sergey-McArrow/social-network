'use server'

import { auth } from '@/auth'
import { z } from 'zod'
import { prisma } from '@/prisma'

const PostSchema = z.object({
  imageUrl: z.string().url(),
  content: z.string().min(1, "Content can't be empty"),
})

type PostInput = z.infer<typeof PostSchema>

export async function addNewPostAction(
  _state: {
    status: string;
    message?: string;
    data?: PostInput;
    errors?: { message: string }[];
  } | null,
  formData: FormData
) {
  try {
    const session = await auth()

    const validatedFields = PostSchema.parse({
      imageUrl: formData.get('imageUrl'),
      content: formData.get('content'),
    })

    if (!session?.user?.id) {
      return {
        status: 'error',
        message: 'User not authenticated',
      }
    }

    await prisma.post.create({
      data: {
        ...validatedFields,
        authorId: session.user.id,
      },
    })

    return {
      status: 'success',
      data: validatedFields,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: 'error',
        errors: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      }
    }
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Something went wrong',
    }
  }
}
