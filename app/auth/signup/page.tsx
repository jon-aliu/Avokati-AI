'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HiMail, HiLockClosed, HiUser, HiArrowRight, HiScale } from 'react-icons/hi'
import { FaGoogle, FaApple } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/lib/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'

export default function SignUpPage() {
  const router = useRouter()
  const { signUp, signInWithGoogle, signInWithApple } = useAuth()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [appleLoading, setAppleLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await signUp(formData.email, formData.password, formData.name)
      toast.success('Account created! Please verify your email.')
      router.push('/auth/verify-email')
    } catch (error: any) {
      console.error('Sign up error:', error)
      
      // Handle specific Firebase error codes
      let errorMessage = 'Failed to create account'
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 6 characters'
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = 'Authentication not configured. Please enable Email/Password in Firebase Console.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      toast.success('Account created successfully!')
      router.push('/chat/logged-in')
    } catch (error: any) {
      console.error('Google sign in error:', error)
      
      let errorMessage = 'Failed to sign in with Google'
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign in cancelled'
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Please allow popups for this site'
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = 'Google Sign-In not configured. Please enable Google in Firebase Console.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleAppleSignIn = async () => {
    setAppleLoading(true)
    try {
      await signInWithApple()
      toast.success('Account created successfully!')
      router.push('/chat/logged-in')
    } catch (error: any) {
      console.error('Apple sign in error:', error)
      
      let errorMessage = 'Failed to sign in with Apple'
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign in cancelled'
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Please allow popups for this site'
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = 'Apple Sign-In not configured. Please enable Apple in Firebase Console.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setAppleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <HiScale className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold gradient-text">
                Avokati AI
              </h1>
            </Link>
            <p className="text-slate-400 mt-2">Create your account</p>
          </div>

          <Card variant="premium">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Get unlimited access to legal research
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  icon={<HiUser className="h-5 w-5" />}
                  required
                />

                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  icon={<HiMail className="h-5 w-5" />}
                  required
                />

                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  icon={<HiLockClosed className="h-5 w-5" />}
                  required
                />

                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  icon={<HiLockClosed className="h-5 w-5" />}
                  required
                />

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={loading}
                  icon={<HiArrowRight />}
                  iconPosition="right"
                >
                  Create Account
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-900/50 text-slate-400">Or continue with</span>
                </div>
              </div>

              {/* Social Sign In Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleGoogleSignIn}
                  loading={googleLoading}
                  disabled={loading || appleLoading}
                  className="w-full"
                >
                  <FaGoogle className="h-5 w-5 mr-2" />
                  Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleAppleSignIn}
                  loading={appleLoading}
                  disabled={loading || googleLoading}
                  className="w-full"
                >
                  <FaApple className="h-5 w-5 mr-2" />
                  Apple
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-cyan-400 hover:text-cyan-300 font-medium">
                    Sign In
                  </Link>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <p className="text-xs text-slate-500 text-center">
                  By creating an account, you agree to our{' '}
                  <Link href="/legal-disclaimer" className="text-cyan-400 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/legal-disclaimer" className="text-cyan-400 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
