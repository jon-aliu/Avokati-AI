'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HiMail, HiCheckCircle, HiArrowRight, HiScale, HiRefresh } from 'react-icons/hi'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/lib/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function VerifyEmailPage() {
  const router = useRouter()
  const { user, sendVerificationEmail, reloadUser, logout } = useAuth()
  const [checking, setChecking] = useState(false)
  const [resending, setResending] = useState(false)
  const [canResend, setCanResend] = useState(true)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    // Redirect if user is already verified
    if (user?.emailVerified) {
      toast.success('Email verified successfully!')
      router.push('/chat/logged-in')
    }

    // Redirect to signin if no user
    if (!user) {
      router.push('/auth/signin')
    }
  }, [user, router])

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleCheckVerification = async () => {
    setChecking(true)
    try {
      await reloadUser()
      
      if (user?.emailVerified) {
        toast.success('Email verified! Redirecting...')
        setTimeout(() => router.push('/chat/logged-in'), 1500)
      } else {
        toast.error('Email not verified yet. Please check your inbox.')
      }
    } catch (error) {
      console.error('Error checking verification:', error)
      toast.error('Failed to check verification status')
    } finally {
      setChecking(false)
    }
  }

  const handleResendEmail = async () => {
    if (!canResend) return
    
    setResending(true)
    try {
      await sendVerificationEmail()
      toast.success('Verification email sent! Check your inbox.')
      setCanResend(false)
      setCountdown(60) // 60 seconds cooldown
    } catch (error: any) {
      console.error('Error resending email:', error)
      
      let errorMessage = 'Failed to send verification email'
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please wait a few minutes.'
      }
      
      toast.error(errorMessage)
    } finally {
      setResending(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/signin')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
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
            <p className="text-slate-400 mt-2">Verify your email</p>
          </div>

          <Card variant="premium">
            <CardHeader className="text-center">
              {/* Animated Mail Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-4"
              >
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <HiMail className="h-10 w-10 text-cyan-400" />
                  </div>
                  {/* Pulse animation */}
                  <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
                </div>
              </motion.div>

              <CardTitle>Check Your Email</CardTitle>
              <CardDescription>
                We sent a verification link to
                <br />
                <span className="text-cyan-400 font-medium">{user?.email}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Instructions */}
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-cyan-400">1</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Open your email inbox
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-cyan-400">2</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Click the verification link in the email
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-cyan-400">3</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Come back here and click "I've Verified My Email"
                  </p>
                </div>
              </div>

              {/* Check Verification Button */}
              <Button
                onClick={handleCheckVerification}
                className="w-full"
                size="lg"
                loading={checking}
                icon={<HiCheckCircle />}
              >
                I've Verified My Email
              </Button>

              {/* Resend Email Button */}
              <div className="relative">
                <Button
                  onClick={handleResendEmail}
                  variant="outline"
                  className="w-full"
                  size="lg"
                  loading={resending}
                  disabled={!canResend}
                  icon={<HiRefresh />}
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
                </Button>
              </div>

              {/* Helpful Tips */}
              <div className="pt-4 border-t border-slate-700/50">
                <p className="text-xs text-slate-500 mb-2">
                  <strong className="text-slate-400">Didn't receive the email?</strong>
                </p>
                <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
                  <li>Check your spam/junk folder</li>
                  <li>Make sure {user?.email} is correct</li>
                  <li>Wait a few minutes and try resending</li>
                </ul>
              </div>

              {/* Logout Option */}
              <div className="pt-4 border-t border-slate-700/50 text-center">
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Sign out and use a different email
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Continue as Guest */}
          <div className="mt-6 text-center">
            <Link href="/chat" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
              Skip for now and continue as guest (3 questions)
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
