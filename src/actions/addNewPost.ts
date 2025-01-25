'use server'

import { auth } from '@clerk/nextjs'
import { z } from 'zod'
import { prisma } from '@/prisma'
import { revalidatePath } from 'next/cache'

const PostSchema = z.object({
  imageUrl: z.string().url(),
  content: z.string().min(1, "Content can't be empty"),
})

type PostInput = z.infer<typeof PostSchema>

type PostState = {
  status: string
  message?: string
  data?: PostInput
  errors?: { message: string }[]
}

export const addNewPostAction = async (
  prevState: PostState | null,
  formData: FormData
) => {
  try {
    const { userId } = auth()
    if (!userId) {
      return {
        status: 'error',
        message: 'User not authenticated',
      }
    }

    const validatedFields = PostSchema.parse({
      imageUrl: formData.get('imageUrl'),
      content: formData.get('content'),
    })

    const post = await prisma.post.create({
      data: {
        ...validatedFields,
        authorId: userId,
      },
    })

    revalidatePath('/')

    return {
      status: 'success',
      message: 'Post created successfully',
      data: post,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: 'error',
        errors: error.errors.map((err) => ({
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
