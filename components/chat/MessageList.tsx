'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiScale } from 'react-icons/hi'
import { Message, Language } from './types'
import { MessageBubble } from './MessageBubble'
import { EmptyState } from './EmptyState'

interface MessageListProps {
  messages: Message[]
  language: Language
  isLoading: boolean
  onSuggestedQuestion: (question: string) => void
  userInfo?: {
    email: string | null
    displayName: string | null
  } | null
}

export function MessageList({
  messages,
  language,
  isLoading,
  onSuggestedQuestion,
  userInfo,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        {/* Empty State */}
        {messages.length === 0 && !isLoading && (
          <EmptyState language={language} onSuggestedQuestion={onSuggestedQuestion} />
        )}

        {/* Messages */}
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <div key={message.id} className="mb-6">
              <MessageBubble
                message={message}
                language={language}
                isLatest={index === messages.length - 1}
                userInfo={userInfo}
              />
            </div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex gap-3"
          >
            {/* AI Avatar - Rotating when thinking */}
            <motion.div 
              className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 grayscale flex items-center justify-center shadow-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <HiScale className="w-4 h-4 text-white" />
            </motion.div>

            {/* Typing Indicator */}
            <div className="flex-1">
              <div className="inline-block px-4 py-3 rounded-2xl bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Scroll Anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
