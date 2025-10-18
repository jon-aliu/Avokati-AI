'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { HiLockClosed, HiScale, HiExclamationCircle, HiChatAlt2 } from 'react-icons/hi'
import Link from 'next/link'
import { getGroqResponse, isGroqConfigured } from '@/lib/groq'
import { useQuestionLimit } from '@/lib/hooks/useQuestionLimit'
import { Language } from '@/lib/i18n'
import { Message } from './types'
import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

export default function GuestChat() {
  const router = useRouter()
  const { questionCount, hasReachedLimit, remainingQuestions, incrementCount, resetTimeString } = useQuestionLimit()

  // UI State
  const [language, setLanguage] = useState<Language>('al')
  const [showLimitModal, setShowLimitModal] = useState(false)

  // Chat State
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiReady, setApiReady] = useState(false)

  // Check API configuration
  useEffect(() => {
    const configured = isGroqConfigured()
    setApiReady(configured)

    if (!configured) {
      toast.error(
        language === 'en'
          ? 'AI service not configured. Please add GROQ_API_KEY.'
          : 'Shërbimi AI nuk është konfiguruar. Ju lutemi shtoni GROQ_API_KEY.'
      )
    }
  }, [language])

  // Handle suggested question
  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  // Handle message submission
  const handleSubmit = async () => {
    if (!input.trim() || isLoading || !apiReady) return

    // Check question limit
    if (hasReachedLimit) {
      setShowLimitModal(true)
      return
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await getGroqResponse(input.trim(), language)

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: response.answer,
        confidence: response.confidence,
        timestamp: new Date(),
        isLawRelated: response.isLawRelated,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Increment question count
      incrementCount()

      // Show limit modal if this was the last question
      if (remainingQuestions === 1) {
        setTimeout(() => setShowLimitModal(true), 2000)
      }

      if (!response.isLawRelated) {
        toast.error(
          language === 'en'
            ? 'This question is not related to Kosovo law'
            : 'Kjo pyetje nuk lidhet me ligjin e Kosovës',
          { duration: 4000 }
        )
      }
    } catch (error) {
      console.error('Error getting response:', error)
      toast.error(
        language === 'en'
          ? 'Failed to get response. Please try again.'
          : 'Dështoi marrja e përgjigjes. Ju lutem provoni përsëri.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden touch-pan-y">
      {/* Enhanced Chat Navbar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-sm border-b border-slate-800/50 sticky top-0 z-50 flex-shrink-0"
      >
        <div className="container-custom py-2 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                transition={isLoading ? { 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "linear" 
                } : { duration: 0.3 }}
                className="relative"
              >
                <div className={`absolute inset-0 rounded-lg sm:rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity ${
                  isLoading ? 'bg-slate-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                }`} />
                <div className={`relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
                  isLoading 
                    ? 'bg-gradient-to-br from-slate-400 to-slate-600 grayscale' 
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                }`}>
                  <HiScale className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-lg font-display font-bold gradient-text">
                  Avokati AI
                </h1>
                <p className="text-xs text-slate-400">
                  {language === 'en' ? 'Legal Assistant' : 'Asistenti Juridik'}
                </p>
              </div>
            </Link>

            {/* Center - Status Badge */}
            <div className="hidden md:flex items-center gap-3">
              <Badge 
                variant={apiReady ? 'success' : 'error'}
                className="animate-pulse-slow"
              >
                {apiReady ? (
                  <>
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {language === 'en' ? 'Online' : 'Në linjë'}
                  </>
                ) : (
                  <>
                    <HiExclamationCircle className="mr-1 h-3 w-3" />
                    {language === 'en' ? 'Offline' : 'Joaktiv'}
                  </>
                )}
              </Badge>

              {messages.length > 0 && (
                <Badge variant="outline" className="text-slate-400">
                  <HiChatAlt2 className="mr-1 h-3 w-3" />
                  {messages.length} {language === 'en' ? 'messages' : 'mesazhe'}
                </Badge>
              )}
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <LanguageSwitcher
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
              
              <Link href="/auth/signin" className="hidden sm:block">
                <Button size="sm" variant="ghost">
                  {language === 'en' ? 'Sign In' : 'Hyni'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Chat Area - Full Width for Guest */}
      <div className="flex-1 flex flex-col min-w-0 h-full w-full relative overflow-hidden">
        <MessageList
          messages={messages}
          language={language}
          isLoading={isLoading}
          onSuggestedQuestion={handleSuggestedQuestion}
        />

        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isDisabled={!apiReady || hasReachedLimit}
          language={language}
        />

        {/* Question Counter */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-4 py-2 rounded-full backdrop-blur-xl border shadow-lg ${
              remainingQuestions === 0
                ? 'bg-red-500/10 border-red-500/30 text-red-300'
                : remainingQuestions === 1
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                : 'bg-slate-800/50 border-slate-700/30 text-slate-300'
            }`}
          >
            <p className="text-xs font-medium text-center">
              {remainingQuestions === 0
                ? language === 'en'
                  ? '🔒 No free questions left'
                  : '🔒 Nuk ka pyetje falas të mbetura'
                : remainingQuestions === 1
                ? language === 'en'
                  ? '⚠️ 1 free question left'
                  : '⚠️ 1 pyetje falas e mbetur'
                : `✨ ${remainingQuestions} ${language === 'en' ? 'free questions left' : 'pyetje falas të mbetura'}`}
            </p>
            {remainingQuestions === 0 && resetTimeString && (
              <p className="text-xs text-center mt-1 opacity-75">
                {language === 'en' ? `Resets ${resetTimeString}` : `Rivendoset ${resetTimeString}`}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Limit Reached Modal */}
      <AnimatePresence>
        {showLimitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLimitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6">
                <HiLockClosed className="w-8 h-8 text-cyan-400" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center mb-3 gradient-text">
                {language === 'en' ? 'Free Questions Limit Reached' : 'Kufiri i Pyetjeve Falas u Mbërriti'}
              </h2>

              {/* Description */}
              <p className="text-slate-300 text-center mb-6">
                {language === 'en'
                  ? "You've used all your free questions. Sign up to get unlimited access to Avokati AI!"
                  : 'Keni përdorur të gjitha pyetjet tuaja falas. Regjistrohuni për të marrë qasje të pakufizuar në Avokati AI!'}
              </p>

              {/* Benefits */}
              <div className="space-y-2 mb-6 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{language === 'en' ? 'Unlimited questions' : 'Pyetje të pakufizuara'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{language === 'en' ? 'Save chat history' : 'Ruaj historinë e bisedave'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{language === 'en' ? 'Priority support' : 'Mbështetje me prioritet'}</span>
                </div>
              </div>

              {/* Reset Info */}
              {resetTimeString && (
                <p className="text-sm text-slate-400 text-center mb-6">
                  {language === 'en'
                    ? `Or wait for free questions to reset ${resetTimeString}`
                    : `Ose prisni që pyetjet falas të rivendosen ${resetTimeString}`}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowLimitModal(false)}
                  className="flex-1"
                >
                  {language === 'en' ? 'Close' : 'Mbyll'}
                </Button>
                <Button
                  onClick={() => router.push('/auth/signup')}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  {language === 'en' ? 'Sign Up Free' : 'Regjistrohu Falas'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
