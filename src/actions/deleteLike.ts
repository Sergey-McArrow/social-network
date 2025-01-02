'use server'
import { auth } from '@/auth'
import { prisma } from '@/prisma'
import { revalidatePath } from 'next/cache'
export const deleteLikeAction = async (formData: FormData) => {
  try {
    const postId = formData.get('postId') as string
    const session = await auth()
    if (!session) throw new Error('User not authenticated')
    if (!postId) throw new Error('Post not found')
    await prisma.like.delete({
      where: { authorId_postId: { authorId: session.user.id, postId } },
    })

    revalidatePath('/')
  } catch (error) {
    console.error(error)
  }
}
