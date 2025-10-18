'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { HiChevronUp, HiLogout, HiUser } from 'react-icons/hi'
import { Language } from './types'

interface UserProfileProps {
  user: {
    email: string | null
    displayName: string | null
  }
  language: Language
  onLogout: () => void
}

export function UserProfile({ user, language, onLogout }: UserProfileProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const getInitials = () => {
    // Get the display name or email username
    const name = user.displayName || user.email?.split('@')[0]
    if (name) {
      return name[0].toUpperCase()
    }
    return 'U'
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors group"
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg shrink-0">
          {getInitials()}
        </div>

        {/* User Info */}
        <div className="flex-1 text-left min-w-0">
          <div className="text-sm font-medium text-white truncate">
            {user.displayName || user.email?.split('@')[0] || (language === 'en' ? 'User' : 'Përdoruesi')}
          </div>
          <div className="text-xs text-slate-400 truncate">{user.email}</div>
        </div>

        {/* Chevron */}
        <HiChevronUp
          className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
            showMenu ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Profile Option */}
            <button
              onClick={() => {
                setShowMenu(false)
                router.push('/profile')
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-left"
            >
              <HiUser className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-white">
                {language === 'en' ? 'Profile' : 'Profili'}
              </span>
            </button>

            {/* Divider */}
            <div className="border-t border-slate-700/50" />

            {/* Logout Option */}
            <button
              onClick={() => {
                setShowMenu(false)
                onLogout()
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors text-left group"
            >
              <HiLogout className="w-5 h-5 text-red-400 group-hover:text-red-300" />
              <span className="text-sm text-red-400 group-hover:text-red-300">
                {language === 'en' ? 'Logout' : 'Dil'}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
