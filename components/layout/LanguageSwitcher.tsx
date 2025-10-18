'use client'

import { motion } from 'framer-motion'
import { HiGlobe } from 'react-icons/hi'
import { Language } from '@/lib/i18n'
import { Button } from '@/components/ui/Button'

interface LanguageSwitcherProps {
  currentLanguage: Language
  onLanguageChange: (language: Language) => void
}

export function LanguageSwitcher({
  currentLanguage,
  onLanguageChange,
}: LanguageSwitcherProps) {
  const toggleLanguage = () => {
    onLanguageChange(currentLanguage === 'en' ? 'al' : 'en')
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      icon={<HiGlobe className="h-4 w-4" />}
      className="relative overflow-hidden"
    >
      <motion.span
        key={currentLanguage}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="font-semibold"
      >
        {currentLanguage === 'en' ? 'EN' : 'SQ'}
      </motion.span>
    </Button>
  )
}
