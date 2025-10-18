import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX',
}

// Initialize Firebase (only on client-side and if all required keys are present)
let app: any = null
let auth: any = null
let db: any = null
let analytics: any = null

const hasValidConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

if (typeof window !== 'undefined' && hasValidConfig) {
  console.log('🔧 Firebase Config Check:', {
    hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  })

  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    auth = getAuth(app)
    db = getFirestore(app)
    
    console.log('✅ Firebase initialized successfully')
    console.log('✅ Firestore DB:', !!db)

    // Analytics (client-side only)
    if (typeof window !== 'undefined') {
      try {
        analytics = getAnalytics(app)
      } catch (e) {
        // Analytics might fail silently in some environments
        console.warn('⚠️ Analytics initialization warning:', e)
      }
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error)
  }
} else if (hasValidConfig) {
  console.log('⏳ Firebase config valid but waiting for client-side initialization')
} else {
  if (typeof window !== 'undefined') {
    console.error('❌ Firebase configuration not found. Missing environment variables.')
    console.log('Required variables:', {
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅' : '❌',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅' : '❌',
    })
  }
}

export { app, auth, db, analytics }
