'use client'

import { motion } from 'framer-motion'
import { HiSparkles, HiUser, HiCheckCircle, HiExclamationCircle, HiScale } from 'react-icons/hi'
import { Message, Language } from './types'
import { Badge } from '@/components/ui/Badge'
import { formatConfidence } from '@/lib/utils'
import { FormattedResponse } from '@/components/ui/FormattedResponse'

interface MessageBubbleProps {
  message: Message
  language: Language
  isLatest?: boolean
  userInfo?: {
    email: string | null
    displayName: string | null
  } | null
}

export function MessageBubble({ message, language, isLatest, userInfo }: MessageBubbleProps) {
  const isUser = message.type === 'user'

  // Get user initial
  const getUserInitial = () => {
    if (!userInfo) return 'G' // Guest
    const name = userInfo.displayName || userInfo.email?.split('@')[0]
    return name ? name[0].toUpperCase() : 'U'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full'
            : 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 rounded-lg'
        }`}
      >
        {isUser ? (
          <span className="text-xs font-bold text-white">
            {getUserInitial()}
          </span>
        ) : (
          <HiScale className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-3xl ${isUser ? 'text-right' : 'text-left'}`}>
        {/* Message Bubble */}
        <div
          className={`inline-block px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
              : 'bg-slate-800/50 text-slate-100'
          }`}
        >
          {isUser ? (
            <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          ) : (
            <div className="prose prose-invert prose-sm md:prose-base max-w-none">
              <FormattedResponse content={message.content} language={language} />
            </div>
          )}
        </div>

        {/* Metadata (Assistant only) */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-2 px-1">
            {/* Confidence Badge */}
            {message.confidence !== undefined && (
              <Badge
                variant={message.confidence >= 0.8 ? 'success' : 'warning'}
                className="text-xs flex items-center gap-1"
              >
                {message.confidence >= 0.8 ? (
                  <HiCheckCircle className="w-3 h-3" />
                ) : (
                  <HiExclamationCircle className="w-3 h-3" />
                )}
                <span>
                  {formatConfidence(message.confidence)}
                </span>
              </Badge>
            )}

            {/* Law Related Indicator */}
            {message.isLawRelated === false && (
              <Badge variant="error" className="text-xs flex items-center gap-1">
                <HiExclamationCircle className="w-3 h-3" />
                <span>
                  {language === 'en' ? 'Not law-related' : 'Nuk lidhet me ligjin'}
                </span>
              </Badge>
            )}

            {/* Timestamp */}
            <span className="text-xs text-slate-500">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}

        {/* User Message Timestamp */}
        {isUser && (
          <div className="text-xs text-slate-500 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}
