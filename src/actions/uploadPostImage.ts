'use server'
import { uploadFile } from '@/lib/gcloud'

type UploadResponse = {
  url: string | null
  error?: string
}

export async function uploadPostImage(
  formData: FormData
): Promise<UploadResponse> {
  try {
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    if (!file) {
      return {
        url: null,
        error: 'No file provided',
      }
    }

    if (!userId) {
      return {
        url: null,
        error: 'User not authenticated',
      }
    }

    if (!file.type.startsWith('image/')) {
      return {
        url: null,
        error: 'Only image files are allowed',
      }
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_FILE_SIZE) {
      return {
        url: null,
        error: 'File size must be less than 5MB',
      }
    }

    const url = await uploadFile(file, `images`)
    return { url }
  } catch (error) {
    console.error('Error uploading file:', error)
    return {
      url: null,
      error: 'Failed to upload file. Please try again.',
    }
  }
}
