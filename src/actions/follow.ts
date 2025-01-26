'use server'

import { z } from 'zod'
import { prisma } from '@/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

const TFollowSchema = z.string({ message: 'UserId is required' })

type TFollowInput = z.infer<typeof TFollowSchema>
type TFollowState = { message: string } | { error: string } | null

export const followOrUnfollow = async (
  _prevState: TFollowState,
  formData: FormData
) => {
  try {
    const id = formData.get('userId') as TFollowInput

    const session = await auth()
    if (!session?.user) {
      return {
        error: 'Unauthorized',
      }
    }

    const parsedInput = TFollowSchema.safeParse(id)
    if (!parsedInput.success) {
      return {
        error: 'Invalid input',
      }
    }

    const userId = parsedInput.data

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { followingIDs: true },
    })

    if (!currentUser) {
      return {
        error: 'User not found',
      }
    }

    const isFollowing = currentUser.followingIDs.includes(id)

    if (isFollowing) {
      // Unfollow
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          following: {
            disconnect: { id: userId },
          },
        },
      })
    } else {
      // Follow
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          following: {
            connect: { id: userId },
          },
        },
      })
    }

    revalidatePath('/profile')
    revalidatePath('/[locale]/profile')

    return { message: 'Success' }
  } catch (error) {
    console.error('Follow action error:', error)
    return {
      error: 'Something went wrong' + JSON.stringify(error),
    }
  }
}
