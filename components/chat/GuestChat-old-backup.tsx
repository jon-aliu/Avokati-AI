'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  HiSparkles, 
  HiPaperAirplane,
  HiCheckCircle,
  HiExclamationCircle,
  HiBookOpen,
  HiLightningBolt,
  HiMenu,
  HiX,
  HiHome,
  HiChatAlt2,
  HiBookmark,
  HiShare,
  HiLockClosed,
  HiScale,
} from 'react-icons/hi'
import { toast } from 'react-hot-toast'
import { Language } from '@/lib/i18n'
import { getGroqResponse, isGroqConfigured } from '@/lib/groq'
import { useQuestionLimit } from '@/lib/hooks/useQuestionLimit'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { cn, formatConfidence } from '@/lib/utils'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  confidence?: number
  timestamp: Date
  isLawRelated?: boolean
}

export default function GuestChat() {
  const router = useRouter()
  const { questionCount, hasReachedLimit, remainingQuestions, incrementCount, resetTimeString } = useQuestionLimit()
  
  const [language, setLanguage] = useState<Language>('al')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiReady, setApiReady] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Check if OpenAI API is configured
  useEffect(() => {
    const configured = isGroqConfigured()
    setApiReady(configured)
    
    if (!configured) {
      toast.error(
        language === 'en'
          ? 'AI service not configured. Please add OPENAI_API_KEY.'
          : 'Shërbimi AI nuk është konfiguruar. Ju lutemi shtoni OPENAI_API_KEY.'
      )
    }
  }, [language])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading || !apiReady) return

    // Check question limit first
    if (hasReachedLimit) {
      setShowLimitModal(true)
      return
    }

    const question = input.trim()
    setInput('')

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: question,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      // Get response from OpenAI
      const response = await getGroqResponse(question, language)

      if (response.isLawRelated) {
        // Only increment counter for law-related questions
        const newCount = incrementCount()
        
        // Show toast with remaining count
        if (newCount < 3) {
          const remaining = 3 - newCount
          toast.success(
            language === 'en'
              ? `${remaining} free question${remaining > 1 ? 's' : ''} remaining`
              : `${remaining} pyetje falas të mbetura`,
            { duration: 3000 }
          )
        } else if (newCount === 3) {
          // Last question used
          toast(
            language === 'en'
              ? 'Free trial ended. Sign up for unlimited access!'
              : 'Testi falas përfundoi. Regjistrohuni për qasje të pakufizuar!',
            { duration: 5000, icon: '🎯' }
          )
          setTimeout(() => setShowLimitModal(true), 2000)
        }
      } else {
        // Non-law related question - reject
        toast.error(
          language === 'en'
            ? 'Please ask questions related to Kosovo law.'
            : 'Ju lutem bëni pyetje të lidhura me ligjin e Kosovës.'
        )
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: response.answer,
        confidence: response.confidence,
        timestamp: new Date(),
        isLawRelated: response.isLawRelated,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      toast.error(
        language === 'en'
          ? 'Failed to get response. Please try again.'
          : 'Dështoi të marrë përgjigje. Ju lutem provoni përsëri.'
      )
    } finally {
      setLoading(false)
    }
  }

  const suggestedQuestions = language === 'en'
    ? [
        'What are the basic labor rights in Kosovo?',
        'How to register a business in Kosovo?',
        'What are digital rights in Kosovo?',
      ]
    : [
        'Cilat janë të drejtat themelore të punës në Kosovë?',
        'Si të regjistrohet një biznes në Kosovë?',
        'Cilat janë të drejtat digjitale në Kosovë?',
      ]

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
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg sm:rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
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

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
          <div className="container-custom max-w-4xl py-4 sm:py-6 px-3 sm:px-4">
            {messages.length === 0 ? (
              // Empty State
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8 sm:py-12"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <HiScale className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-2 sm:mb-3">
                  {language === 'en'
                    ? 'Welcome to Avokati AI'
                    : 'Mirësevini në Avokati AI'}
                </h2>
                <p className="text-sm sm:text-base text-slate-400 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                  {language === 'en'
                    ? 'Ask legal questions about Kosovo law and get instant answers'
                    : 'Bëni pyetje ligjore rreth ligjit të Kosovës dhe merrni përgjigje të menjëhershme'}
                </p>

                {/* Suggested Questions */}
                <div className="space-y-2 sm:space-y-3 max-w-2xl mx-auto px-4">
                  <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">
                    {language === 'en' ? 'Try asking:' : 'Provoni të pyesni:'}
                  </p>
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="w-full p-3 sm:p-4 glass-sm hover:glass rounded-lg sm:rounded-xl text-left text-slate-300 hover:text-white transition-all duration-200 group touch-manipulation"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <HiSparkles className="text-cyan-400 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs sm:text-sm">{question}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        'flex gap-2 sm:gap-2.5 md:gap-3 group',
                        message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                      )}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0 pt-0.5 sm:pt-1">
                        {message.type === 'user' ? (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
                            G
                          </div>
                        ) : (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <HiScale className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Message Content */}
                      <div className={cn(
                        'flex-1 min-w-0 max-w-[calc(100%-3rem)] sm:max-w-[85%]',
                        message.type === 'user' ? 'flex justify-end' : ''
                      )}>
                        <div className={cn(
                          'inline-block w-full sm:w-auto rounded-xl sm:rounded-2xl px-3 py-2 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3',
                          message.type === 'user'
                            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                            : 'bg-slate-800/70 border border-slate-700/50 text-slate-50'
                        )}>
                          {/* Message Text */}
                          <div className="prose prose-invert prose-sm max-w-none break-words">
                            <p className="text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-wrap m-0">
                              {message.content}
                            </p>
                          </div>

                          {/* Footer - Only for assistant */}
                          {message.type === 'assistant' && (
                            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-2.5 md:mt-3 pt-2 sm:pt-2.5 md:pt-3 border-t border-slate-700/40">
                              {/* Confidence */}
                              {message.confidence !== undefined && (
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <div className={cn(
                                    'w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full',
                                    message.confidence > 0.8 ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' :
                                    message.confidence > 0.6 ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50' :
                                    'bg-red-400 shadow-lg shadow-red-400/50'
                                  )} />
                                  <span className="text-[10px] sm:text-xs font-medium text-slate-300">
                                    {formatConfidence(message.confidence)}
                                  </span>
                                </div>
                              )}

                              {/* Timestamp */}
                              <span className="text-[10px] sm:text-xs text-slate-500 ml-auto">
                                {message.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                          )}

                          {/* Timestamp for user messages */}
                          {message.type === 'user' && (
                            <div className="text-[10px] sm:text-xs text-cyan-100/80 mt-1.5 sm:mt-2 font-medium">
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2 sm:gap-2.5 md:gap-3"
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0 pt-0.5 sm:pt-1 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <HiScale className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                    </div>

                    {/* Loading Bubble */}
                    <div className="inline-block rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-800/70 border border-slate-700/50">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Input Form */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-sm border-t border-slate-800/50 p-2.5 sm:p-3 md:p-4 lg:p-6 flex-shrink-0 safe-area-bottom"
      >
        <form onSubmit={handleSubmit} className="container-custom max-w-4xl">
          <div className="relative">
            {/* Input Container with Modern Design */}
            <div className="relative glass rounded-xl sm:rounded-2xl border border-slate-700/50 focus-within:border-cyan-500/50 transition-all duration-300 overflow-hidden shadow-xl">
              {/* Gradient Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder={
                  language === 'en'
                    ? 'Ask a legal question...'
                    : 'Bëni një pyetje ligjore...'
                }
                className="w-full bg-transparent border-none focus:ring-0 resize-none pr-11 sm:pr-12 md:pr-14 p-2.5 sm:p-3 md:p-4 min-h-[48px] sm:min-h-[52px] md:min-h-[60px] max-h-[120px] sm:max-h-[150px] md:max-h-[200px] text-sm sm:text-base touch-manipulation"
                disabled={loading || !apiReady}
              />

              {/* Send Button */}
              <div className="absolute right-1.5 bottom-1.5 sm:right-2 sm:bottom-2 md:right-3 md:bottom-3">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || loading || !apiReady}
                  className="rounded-lg sm:rounded-xl touch-manipulation active:scale-95"
                  aria-label="Send message"
                >
                  {loading ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <HiPaperAirplane className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Helper Text */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 mt-2 px-2">
              <p className="text-[10px] sm:text-xs text-slate-500">
                {language === 'en'
                  ? 'Press Enter to send, Shift+Enter for new line'
                  : 'Shtyp Enter për të dërguar, Shift+Enter për rresht të ri'}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500">
                {language === 'en' ? 'Powered by OpenAI GPT-4' : 'Mundësuar nga OpenAI GPT-4'}
              </p>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Limit Modal */}
      <AnimatePresence>
        {showLimitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLimitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-heavy border border-slate-700/50 rounded-2xl p-8 max-w-md w-full"
            >
              {/* Icon */}
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-4">
                  <HiLockClosed className="h-8 w-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold gradient-text mb-2">
                  {language === 'en' ? 'Free Trial Ended' : 'Testi Falas Përfundoi'}
                </h3>
                <p className="text-slate-400 mb-4">
                  {language === 'en'
                    ? 'You\'ve used all 3 free questions for today.'
                    : 'Keni përdorur të gjitha 3 pyetjet falas për sot.'}
                </p>
                
                {/* Reset Timer */}
                {resetTimeString && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <HiLightningBolt className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm text-cyan-300">
                      {language === 'en' 
                        ? `Resets in ${resetTimeString}`
                        : `Rifillon në ${resetTimeString}`
                      }
                    </span>
                  </div>
                )}
              </div>

              {/* Benefits */}
              <div className="mb-6 space-y-3">
                <div className="text-sm font-semibold text-slate-300 mb-3">
                  {language === 'en' ? 'Or sign in for unlimited access:' : 'Ose hyni për qasje të pakufizuar:'}
                </div>
                <div className="flex items-start gap-3">
                  <HiCheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">
                    {language === 'en' ? 'Unlimited questions' : 'Pyetje të pakufizuara'}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <HiCheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">
                    {language === 'en' ? 'Save chat history' : 'Ruani historinë e bisedave'}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <HiCheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">
                    {language === 'en' ? 'Share conversations' : 'Ndani bisedat'}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <Link href="/auth/signup" className="w-full">
                  <Button className="w-full" size="lg" icon={<HiSparkles />}>
                    {language === 'en' ? 'Create Free Account' : 'Krijoni Llogari Falas'}
                  </Button>
                </Link>
                <Link href="/auth/signin" className="w-full">
                  <Button variant="outline" className="w-full" size="lg">
                    {language === 'en' ? 'Sign In' : 'Hyni'}
                  </Button>
                </Link>
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {language === 'en' ? 'Maybe later' : 'Ndoshta më vonë'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Free Questions Counter - Fixed Bottom Right */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40"
      >
        <div className={cn(
          "glass-heavy rounded-xl px-4 py-2 border transition-all duration-300",
          remainingQuestions === 0
            ? "border-red-500/30 bg-red-500/10"
            : remainingQuestions === 1
            ? "border-yellow-500/30 bg-yellow-500/10"
            : "border-cyan-500/30"
        )}>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <HiSparkles className={cn(
                "h-4 w-4",
                remainingQuestions === 0
                  ? "text-red-400"
                  : remainingQuestions === 1
                  ? "text-yellow-400"
                  : "text-cyan-400"
              )} />
              <span className="text-sm font-medium text-white">
                {remainingQuestions} {language === 'en' ? 'free questions left' : 'pyetje falas të mbetura'}
              </span>
            </div>
            
            {/* Reset countdown when limit reached */}
            {remainingQuestions === 0 && resetTimeString && (
              <div className="flex items-center gap-1.5 pl-6">
                <HiLightningBolt className="h-3 w-3 text-cyan-400" />
                <span className="text-xs text-slate-400">
                  {language === 'en' 
                    ? `Resets in ${resetTimeString}`
                    : `Rifillon në ${resetTimeString}`
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
