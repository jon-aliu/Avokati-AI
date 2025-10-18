'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  reload,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  deleteUser,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { createUserDocument, deleteUserData } from '@/lib/firestore'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  logout: () => Promise<void>
  sendVerificationEmail: () => Promise<void>
  reloadUser: () => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signInWithApple: async () => {},
  logout: async () => {},
  sendVerificationEmail: async () => {},
  reloadUser: async () => {},
  deleteAccount: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      // Only set up auth listener if Firebase is configured and we're on client
      if (typeof window === 'undefined' || !auth) {
        setLoading(false)
        return
      }

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user)
        
        // Create user document in Firestore if user exists and email is verified
        if (user && user.emailVerified && user.email) {
          try {
            console.log('📧 Email verified, ensuring user document exists')
            await createUserDocument(user.uid, user.email, user.displayName)
          } catch (error) {
            console.error('Error creating user document:', error)
          }
        }
        
        setLoading(false)
      })

      return unsubscribe
    } catch (error) {
      console.error('Auth provider initialization error:', error)
      setLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      throw new Error('Firebase is not configured. Please set up your Firebase credentials.')
    }
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (!auth) {
      throw new Error('Firebase is not configured. Please set up your Firebase credentials.')
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, { displayName: name })
    
    // Send verification email automatically after signup
    await sendEmailVerification(userCredential.user)
    
    // Note: User document will be created automatically by onAuthStateChanged
    // once the email is verified
  }

  const signInWithGoogle = async () => {
    if (!auth) {
      throw new Error('Firebase is not configured. Please set up your Firebase credentials.')
    }
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({
      prompt: 'select_account'
    })
    const result = await signInWithPopup(auth, provider)
    
    // Create user document for Google sign-in (email is already verified)
    if (result.user && result.user.email) {
      try {
        await createUserDocument(result.user.uid, result.user.email, result.user.displayName)
      } catch (error) {
        console.error('Error creating user document after Google sign-in:', error)
      }
    }
  }

  const signInWithApple = async () => {
    if (!auth) {
      throw new Error('Firebase is not configured. Please set up your Firebase credentials.')
    }
    const provider = new OAuthProvider('apple.com')
    provider.addScope('email')
    provider.addScope('name')
    const result = await signInWithPopup(auth, provider)
    
    // Create user document for Apple sign-in (email is already verified)
    if (result.user && result.user.email) {
      try {
        await createUserDocument(result.user.uid, result.user.email, result.user.displayName)
      } catch (error) {
        console.error('Error creating user document after Apple sign-in:', error)
      }
    }
  }

  const logout = async () => {
    if (!auth) return
    await signOut(auth)
  }

  const sendVerificationEmail = async () => {
    if (!auth || !auth.currentUser) {
      throw new Error('No user is currently signed in')
    }
    await sendEmailVerification(auth.currentUser)
  }

  const reloadUser = async () => {
    if (!auth || !auth.currentUser) return
    await reload(auth.currentUser)
    setUser(auth.currentUser)
  }

  const deleteAccount = async () => {
    if (!auth || !auth.currentUser) {
      throw new Error('No user is currently signed in')
    }

    const userId = auth.currentUser.uid
    console.log('🗑️ Starting account deletion process for user:', userId)

    try {
      // Step 1: Delete all Firestore data (user document + chat history)
      console.log('🗑️ Deleting Firestore data...')
      await deleteUserData(userId)
      console.log('✅ Firestore data deleted')

      // Step 2: Delete Firebase Authentication account
      console.log('🗑️ Deleting Firebase Auth account...')
      await deleteUser(auth.currentUser)
      console.log('✅ Firebase Auth account deleted')

      console.log('🎉 Account deletion completed successfully')
    } catch (error) {
      console.error('❌ Error deleting account:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signInWithApple, logout, sendVerificationEmail, reloadUser, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
