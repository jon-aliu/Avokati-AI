'use client'

import { motion } from 'framer-motion'
import { HiMenu, HiStar, HiOutlineStar, HiShare, HiScale } from 'react-icons/hi'
import Link from 'next/link'
import { Language, ChatSession } from './types'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

interface ChatHeaderProps {
  currentChat: ChatSession | null
  language: Language
  onLanguageChange: (lang: Language) => void
  onToggleSidebar: () => void
  onTogglePin?: () => void
  onShare?: () => void
  isLoading?: boolean
  isSaving?: boolean
}

export function ChatHeader({
  currentChat,
  language,
  onLanguageChange,
  onToggleSidebar,
  onTogglePin,
  onShare,
  isLoading = false,
  isSaving = false,
}: ChatHeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50"
    >
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        {/* Left: Menu + Logo + Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Menu Toggle (Mobile) */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
            aria-label="Toggle sidebar"
          >
            <HiMenu className="w-5 h-5 text-slate-300" />
          </button>

          {/* Logo */}
          <Link href="/chat" className="flex items-center gap-2 group shrink-0">
            <motion.div
              animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
              transition={isLoading ? { 
                duration: 2, 
                repeat: Infinity, 
                ease: "linear" 
              } : { duration: 0.3 }}
              className="relative"
            >
              <div className={`absolute inset-0 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity ${
                isLoading ? 'bg-slate-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'
              }`} />
              <div className={`relative p-1.5 rounded-full transition-all duration-300 ${
                isLoading 
                  ? 'bg-gradient-to-br from-slate-400 to-slate-600 grayscale' 
                  : 'bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600'
              }`}>
                <HiScale className="h-4 w-4 text-white" />
              </div>
            </motion.div>
          </Link>

          {/* Chat Title */}
          {currentChat && (
            <div className="flex items-center gap-2 min-w-0">
              {currentChat.isPinned && (
                <HiStar className="w-4 h-4 text-yellow-400 shrink-0" />
              )}
              <h1 className="text-lg font-semibold text-white truncate">
                {currentChat.title}
              </h1>
              {/* Saving Indicator */}
              {isSaving && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-slate-400 flex items-center gap-1 shrink-0"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    💾
                  </motion.span>
                  {language === 'en' ? 'Saving...' : 'Duke ruajtur...'}
                </motion.span>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Pin Button */}
          {currentChat && onTogglePin && (
            <button
              onClick={onTogglePin}
              className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
              title={currentChat.isPinned ? 'Unpin chat' : 'Pin chat'}
            >
              {currentChat.isPinned ? (
                <HiStar className="w-5 h-5 text-yellow-400" />
              ) : (
                <HiOutlineStar className="w-5 h-5 text-slate-400 hover:text-yellow-400" />
              )}
            </button>
          )}

          {/* Share Button */}
          {currentChat && onShare && (
            <button
              onClick={onShare}
              className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
              title="Share chat"
            >
              <HiShare className="w-5 h-5 text-slate-400 hover:text-cyan-400" />
            </button>
          )}

          {/* Language Switcher */}
          <LanguageSwitcher currentLanguage={language} onLanguageChange={onLanguageChange} />
        </div>
      </div>
    </motion.header>
  )
}
