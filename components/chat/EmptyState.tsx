'use client'

import { motion } from 'framer-motion'
import { HiLightningBolt, HiScale } from 'react-icons/hi'
import { Language } from './types'

interface EmptyStateProps {
  language: Language
  onSuggestedQuestion: (question: string) => void
}

export function EmptyState({ language, onSuggestedQuestion }: EmptyStateProps) {
  const suggestedQuestions = language === 'en'
    ? [
        'What are the legal requirements for starting a business in Kosovo?',
        'How can I register a company in Kosovo?',
        'What are my rights if I am arrested in Kosovo?',
        'How does the court system work in Kosovo?',
      ]
    : [
        'Cilat janë ligjet e punës në Kosovë?',
        'Si të regjistrojë një biznes në Kosovë?',
        'Cilat janë të drejtat e mia si qiramarrës në Kosovë?',
        'Si funksionon sistemi gjyqësor në Kosovë?',
      ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full px-4 py-12"
    >
      {/* Logo/Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/50">
          <HiScale className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      {/* Welcome Text */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl md:text-3xl font-display font-bold gradient-text mb-3 text-center"
      >
        {language === 'en' ? 'Welcome to Avokati AI' : 'Mirësevini në Avokati AI'}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-slate-400 text-center max-w-md mb-8"
      >
        {language === 'en'
          ? 'Your AI-powered legal assistant for Kosovo law. Ask me anything!'
          : 'Asistenti juaj ligjor i fuqizuar nga AI për ligjin e Kosovës. Pyetni çfarë të doni!'}
      </motion.p>

      {/* Suggested Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-2xl space-y-3"
      >
        <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
          <HiLightningBolt className="w-4 h-4" />
          {language === 'en' ? 'Try asking:' : 'Provoni të pyesni:'}
        </h3>

        <div className="grid gap-3 md:grid-cols-2">
          {suggestedQuestions.map((question, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              onClick={() => onSuggestedQuestion(question)}
              className="group relative bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 rounded-xl p-4 text-left transition-all duration-200 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative flex items-start gap-3">
                <HiLightningBolt className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  {question}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
