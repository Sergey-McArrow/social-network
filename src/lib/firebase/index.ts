// Import the functions you need from the SDKs you need
import { FirebaseOptions, getApp, getApps, initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics'
import { getDatabase } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
const APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID
const MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

const firebaseConfig: FirebaseOptions = {
  apiKey: API_KEY,
  authDomain: 'tail-gramm.firebaseapp.com',
  projectId: 'tail-gramm',
  storageBucket: 'tail-gramm.firebasestorage.app',
  databaseURL:
    'https://tail-gramm-default-rtdb.europe-west1.firebasedatabase.app',
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
}

// Initialize Firebase
export const clientApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig)
// export const analytics = getAnalytics(app)
export const database = getDatabase(clientApp)
