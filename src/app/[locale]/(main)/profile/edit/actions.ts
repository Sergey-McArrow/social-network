'use server'

import { auth } from '@/auth'
import { prisma } from '@/prisma'
import { revalidatePath } from 'next/cache'
import { uploadFile } from '@/lib/gcloud'

export type ProfileFormData = {
  name: string
  website?: string
  bio?: string
  userImage?: string
}

export type ProfileFormState = {
  errors?: {
    name?: string[]
    website?: string[]
    bio?: string[]
    userImage?: string[]
    _form?: string[]
  }
  message?: string
}

export async function updateProfile(
  _prevState: ProfileFormState | null,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await auth()

  if (!session?.user?.email) {
    return {
      errors: {
        _form: ['Not authenticated'],
      },
    }
  }

  const data: ProfileFormData = {
    name: formData.get('username') as string,
    website: formData.get('website') as string,
    bio: formData.get('about') as string,
  }

  const avatarFile = formData.get('avatar') as File
  if (avatarFile?.size > 0) {
    try {
      data.userImage = await uploadFile(avatarFile, 'avatars')
    } catch (err) {
      console.log(err)

      return {
        errors: {
          userImage: ['Failed to upload avatar'],
        },
      }
    }
  }

  const errors: ProfileFormState['errors'] = {}

  if (!data.name || data.name.length < 3) {
    errors.name = ['Name must be at least 3 characters long']
  }

  if (data.website && !data.website.startsWith('https://')) {
    errors.website = ['Website must start with https://']
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    }
  }
  console.log({ data })

  try {
    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data,
    })

    revalidatePath('/profile')
    revalidatePath('/profile/edit')

    return {
      message: 'Profile updated successfully',
    }
  } catch (err) {
    console.log(err)

    return {
      errors,
    }
  }
}
