import {
  cert,
  getApp,
  getApps,
  initializeApp,
  ServiceAccount,
} from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
if (!privateKey) {
  throw new Error('Missing environment variables: FIREBASE_ADMIN_PRIVATE_KEY')
}

if (!process.env.FIREBASE_ADMIN_DATABASE_URL) {
  throw new Error('Missing environment variables: FIREBASE_ADMIN_DATABASE_URL')
}

export const adminApp = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert({
        projectId: 'tail-gramm',
        clientEmail:
          'firebase-adminsdk-mdok5@tail-gramm.iam.gserviceaccount.com',
        privateKey,
      } as ServiceAccount),
      databaseURL: process.env.FIREBASE_ADMIN_DATABASE_URL,
    })

export const adminDatabase = getDatabase(adminApp)
export const adminRef = adminDatabase.ref('/chats')
