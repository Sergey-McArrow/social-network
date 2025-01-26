'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/prisma'
import { revalidatePath } from 'next/cache'
import { deleteFile, uploadFile } from '@/lib/gcloud'

export type TProfileFormData = {
  name: string
  website?: string
  bio?: string
  userImage?: string
}

export type TProfileFormState = {
  errors?: {
    name?: string[]
    website?: string[]
    bio?: string[]
    userImage?: string[]
    _form?: string[]
  }
  message?: string
}

export const updateProfileAction = async (
  _prevState: TProfileFormState | null,
  formData: FormData
): Promise<TProfileFormState> => {
  try {
    const { userId } = await auth()
    if (!userId) {
      return {
        errors: {
          _form: ['User not authenticated'],
        },
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return {
        errors: {
          _form: ['User not found'],
        },
      }
    }

    const name = formData.get('name') as string
    const website = formData.get('website') as string
    const bio = formData.get('bio') as string
    const userImage = formData.get('userImage') as File

    if (!name) {
      return {
        errors: {
          name: ['Name is required'],
        },
      }
    }

    let userImageUrl = user.userImage

    if (userImage && userImage.size > 0) {
      if (user.userImage) {
        await deleteFile(user.userImage, 'users')
      }
      userImageUrl = await uploadFile(userImage, 'users')
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        website,
        bio,
        userImage: userImageUrl,
      },
    })

    revalidatePath('/profile')

    return {
      message: 'Profile updated successfully',
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    return {
      errors: {
        _form: [
          error instanceof Error ? error.message : 'Failed to update profile',
        ],
      },
    }
  }
}
