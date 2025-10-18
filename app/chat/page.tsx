'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiScale } from 'react-icons/hi'
import { useAuth } from '@/lib/contexts/AuthContext'
import dynamic from 'next/dynamic'

const GuestChatPage = dynamic(() => import('@/components/chat/GuestChat'), { ssr: false })
const LoggedInChatPage = dynamic(() => import('@/components/chat/LoggedInChat'), { ssr: false })

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      setTimeout(() => setShowContent(true), 300)
    }
  }, [authLoading])

  if (authLoading || !showContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center">
          <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="mb-6 inline-block">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/50">
              <HiScale className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl font-display font-bold gradient-text mb-3">
            Avokati AI
          </motion.h2>
          <div className="flex items-center justify-center gap-2">
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-cyan-400 rounded-full" />
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-cyan-400 rounded-full" />
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-cyan-400 rounded-full" />
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-slate-400 text-sm mt-4">
            Loading...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return user ? <LoggedInChatPage /> : <GuestChatPage />
}
