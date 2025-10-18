'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { HiMenu, HiX, HiSparkles, HiScale, HiUser, HiChatAlt2 } from 'react-icons/hi'
import { Language } from '@/lib/i18n'
import { Button } from '@/components/ui/Button'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useAuth } from '@/lib/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface NavbarProps {
  language: Language
  onLanguageChange: (language: Language) => void
}

export function Navbar({ language, onLanguageChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, loading } = useAuth()

  // Get user initials
  const getUserInitials = (name: string | null, email: string | null) => {
    if (name) {
      const names = name.trim().split(' ')
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }
    if (email) {
      return email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  const userInitials = getUserInitials(user?.displayName || null, user?.email || null)

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/', label: language === 'en' ? 'Home' : 'Ballina' },
    { href: '/chat', label: 'Chat' },
    { href: '/pricing', label: language === 'en' ? 'Pricing' : 'Çmimet' },
  ]

  return (
    <nav className="sticky top-0 z-50 glass-sm border-b border-slate-800/50">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
              <HiScale className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-xl font-bold gradient-text">
              Avokati AI
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-cyan-400 relative group',
                  isActive(item.href)
                    ? 'text-cyan-400'
                    : 'text-slate-300'
                )}
              >
                {item.label}
                {/* Active Indicator */}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
            />
            
            {!loading && (
              <>
                {user ? (
                  // Logged in - Show Chat and Profile buttons
                  <>
                    <Link href="/chat">
                      <Button variant="ghost" size="sm" icon={<HiChatAlt2 />}>
                        {language === 'en' ? 'Chat' : 'Bisedë'}
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button 
                        size="sm" 
                        icon={
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <span className="text-[8px] font-bold text-white">
                              {userInitials}
                            </span>
                          </div>
                        }
                      >
                        {language === 'en' ? 'Profile' : 'Profili'}
                      </Button>
                    </Link>
                  </>
                ) : (
                  // Not logged in - Show Sign In and Try Free buttons
                  <>
                    <Link href="/auth/signin">
                      <Button variant="ghost" size="sm">
                        {language === 'en' ? 'Sign In' : 'Hyr'}
                      </Button>
                    </Link>
                    <Link href="/chat">
                      <Button size="sm" icon={<HiSparkles />}>
                        {language === 'en' ? 'Try Free' : 'Provo Falas'}
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
          >
            {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-slate-800/50"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'text-cyan-400'
                      : 'text-slate-300 hover:text-cyan-400'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-800/50 flex flex-col gap-3">
                <LanguageSwitcher
                  currentLanguage={language}
                  onLanguageChange={onLanguageChange}
                />
                
                {!loading && (
                  <>
                    {user ? (
                      // Logged in - Show Chat and Profile buttons
                      <>
                        <Link href="/chat" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" size="sm" icon={<HiChatAlt2 />} className="w-full">
                            {language === 'en' ? 'Chat' : 'Bisedë'}
                          </Button>
                        </Link>
                        <Link href="/profile" onClick={() => setIsOpen(false)}>
                          <Button 
                            size="sm" 
                            icon={
                              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-white">
                                  {userInitials}
                                </span>
                              </div>
                            }
                            className="w-full"
                          >
                            {language === 'en' ? 'Profile' : 'Profili'}
                          </Button>
                        </Link>
                      </>
                    ) : (
                      // Not logged in - Show Sign In and Try Free buttons
                      <>
                        <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" size="sm" className="w-full">
                            {language === 'en' ? 'Sign In' : 'Hyr'}
                          </Button>
                        </Link>
                        <Link href="/chat" onClick={() => setIsOpen(false)}>
                          <Button size="sm" icon={<HiSparkles />} className="w-full">
                            {language === 'en' ? 'Try Free' : 'Provo Falas'}
                          </Button>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
