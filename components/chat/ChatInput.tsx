'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiPaperAirplane } from 'react-icons/hi'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Language } from './types'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
  isDisabled?: boolean
  language: Language
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  isDisabled = false,
  language,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && !isDisabled && value.trim()) {
        onSubmit()
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoading && !isDisabled && value.trim()) {
      onSubmit()
    }
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky bottom-0 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pt-6 pb-4 px-4"
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              language === 'en'
                ? 'Ask a question about Kosovo law...'
                : 'Bëni një pyetje për ligjin e Kosovës...'
            }
            disabled={isDisabled || isLoading}
            className="min-h-[60px] max-h-[200px] resize-none bg-transparent border-none focus:ring-0 text-white placeholder-slate-400 pr-14"
            rows={1}
          />

          {/* Send Button */}
          <div className="absolute right-2 bottom-2">
            <Button
              type="submit"
              disabled={isDisabled || isLoading || !value.trim()}
              className="rounded-xl p-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <HiPaperAirplane className="w-5 h-5 text-white" />
                </motion.div>
              ) : (
                <HiPaperAirplane className="w-5 h-5 text-white" />
              )}
            </Button>
          </div>
        </div>

        {/* Helper Text */}
        <div className="flex items-center justify-between mt-2 px-2">
          <p className="text-xs text-slate-500">
            {language === 'en' ? 'Press Enter to send, Shift+Enter for new line' : 'Shtyp Enter për të dërguar, Shift+Enter për rresht të ri'}
          </p>
          <span className="text-xs text-slate-500">
            {value.length} / 2000
          </span>
        </div>
      </form>
    </motion.div>
  )
}
