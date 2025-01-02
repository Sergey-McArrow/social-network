'use server'
import { Storage } from '@google-cloud/storage'
import { v4 as uuidv4 } from 'uuid'
const projectId = process.env.GOOGLE_STORAGE_PROJECT_ID
const clientEmail = process.env.GOOGLE_STORAGE_CLIENT_EMAIL
const privateKey = process.env.GOOGLE_STORAGE_PRIVATE_KEY
const bucketName = process.env.GOOGLE_STORAGE_BUCKET

if (!projectId || !clientEmail || !privateKey || !bucketName) {
  throw new Error('Missing environment variables')
}

const storage = new Storage({
  projectId,
  credentials: {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, '\n'),
  },
})

export const uploadFile = async (file: File, directory: string) => {
  try {
    const fileType = file.type
    const originalName = file.name
    const destFileName = `${directory}/${uuidv4()}.${originalName
      .split('.')
      .pop()}`

    const bucket = storage.bucket(bucketName)
    const fileInstance = bucket.file(destFileName)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await fileInstance.save(buffer, {
      metadata: {
        contentType: fileType,
      },
    })

    return `https://storage.cloud.google.com/${bucketName}/${destFileName}`
  } catch (error) {
    console.error('Error uploading file:', JSON.stringify(error, null, 2))
    throw new Error(
      error instanceof Error ? error.message : 'Failed to upload file'
    )
  }
}
export const deleteFile = async (fileUrl: string, directory: string) => {
  try {
    const bucket = storage.bucket(bucketName)
    const fileName = fileUrl.split('/').pop()
    await bucket.file(`${directory}/${fileName}`).delete()
  } catch (error) {
    console.error('Error deleting file:', JSON.stringify(error, null, 2))
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete file'
    )
  }
}
