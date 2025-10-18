'use client'

import { motion } from 'framer-motion'
import { HiBookOpen, HiDocumentText, HiCheckCircle, HiExternalLink, HiInformationCircle } from 'react-icons/hi'
import { parseAIResponse, formatMarkdown, extractReferencesAndDisclaimer, type ParsedResponse } from '@/lib/responseParser'
import { Badge } from './Badge'

interface FormattedResponseProps {
  content: string
  language: 'en' | 'al'
}

export function FormattedResponse({ content, language }: FormattedResponseProps) {
  const parsed = parseAIResponse(content)
  const { mainContent, references, disclaimer, gzkLinks } = extractReferencesAndDisclaimer(content)
  
  return (
    <div className="space-y-4">
      {/* Main Content Sections */}
      {parsed.sections.map((section, index) => {
        // Skip if this section is a reference or disclaimer
        const sectionText = (section.title || '') + ' ' + (section.content || '')
        const isReference = sectionText.includes('**Referenca:**') || sectionText.includes('Referenca:')
        const isDisclaimer = sectionText.toLowerCase().includes('general information') || 
                            sectionText.toLowerCase().includes('informacion i përgjithshëm') ||
                            sectionText.toLowerCase().includes('consult') ||
                            sectionText.toLowerCase().includes('konsultohuni')
        
        if (isReference || isDisclaimer) return null
        
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            {/* Numbered or Bold Title */}
            {(section.title || section.number) && (
              <div className="flex items-start gap-2">
                {section.isNumbered && section.number && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-cyan-400">{section.number}</span>
                  </div>
                )}
                <h4 
                  className="font-semibold text-white leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(section.title || '') }}
                />
              </div>
            )}
            
            {/* Content */}
            {section.content && (
              <div 
                className={`text-sm text-slate-300 leading-relaxed ${section.isNumbered ? 'pl-9' : ''}`}
                dangerouslySetInnerHTML={{ __html: formatMarkdown(section.content) }}
              />
            )}
          </motion.div>
        )
      })}
      
      {/* Law References with Links */}
      {(references.length > 0 || gzkLinks.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 pt-4 border-t border-slate-700/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <HiBookOpen className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-300">
              {language === 'en' ? 'Legal References' : 'Referencat Ligjore'}
            </span>
          </div>
          
          <div className="space-y-2">
            {references.map((ref: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-start gap-2 text-sm"
              >
                <HiDocumentText className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300 leading-relaxed">{ref}</span>
              </motion.div>
            ))}
            
            {gzkLinks.map((link: { text: string; url: string }, index: number) => (
              <motion.a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors group"
              >
                <HiExternalLink className="h-4 w-4 flex-shrink-0" />
                <span className="group-hover:underline">{link.text}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Disclaimer - Lower Opacity */}
      {disclaimer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 pt-4 border-t border-slate-700/20"
        >
          <div className="flex items-start gap-2 opacity-50 hover:opacity-70 transition-opacity">
            <HiInformationCircle className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-slate-400 leading-relaxed italic">
              {disclaimer}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
