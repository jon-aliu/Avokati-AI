/**
 * Format and parse AI response to extract law references and structure
 */

export interface ParsedResponse {
  sections: Section[]
  lawReferences: LawReference[]
  summary?: string
}

export interface Section {
  id: string
  title?: string
  content: string
  isBold?: boolean
  isNumbered?: boolean
  number?: string
}

export interface LawReference {
  lawName: string
  article?: string
  paragraph?: string
  text?: string
}

/**
 * Parse AI response to extract structured content
 */
export function parseAIResponse(content: string): ParsedResponse {
  const sections: Section[] = []
  const lawReferences: LawReference[] = []
  
  // Split by double newlines for paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim())
  
  paragraphs.forEach((para, index) => {
    const trimmed = para.trim()
    
    // Check for numbered items (1., 2., etc.)
    const numberedMatch = trimmed.match(/^(\d+)\.\s*\*\*(.+?)\*\*[:\s]*(.*)$/s)
    if (numberedMatch) {
      sections.push({
        id: `section-${index}`,
        number: numberedMatch[1],
        title: numberedMatch[2],
        content: numberedMatch[3],
        isNumbered: true,
        isBold: true,
      })
      return
    }
    
    // Check for bold headers (**text**)
    const boldMatch = trimmed.match(/^\*\*(.+?)\*\*[:\s]*(.*)$/s)
    if (boldMatch) {
      sections.push({
        id: `section-${index}`,
        title: boldMatch[1],
        content: boldMatch[2],
        isBold: true,
      })
      return
    }
    
    // Regular paragraph
    sections.push({
      id: `section-${index}`,
      content: trimmed,
    })
  })
  
  // Extract law references from content
  const lawPatterns = [
    // Pattern: "Kodi i Punës", "Kodi i Punës i Republikës së Kosovës"
    /(?:Kod[iï]\s+(?:i|të)\s+[\wëçñö\s]+)/gi,
    // Pattern: "Ligji Nr. XX/YYYY", "Ligj XX/YYYY"
    /(?:Ligj[ëit]*\s+(?:Nr\.\s*)?[\d\/\-]+)/gi,
    // Pattern: "Neni X", "Nenet X-Y"
    /(?:Nen[eit]*\s+[\dIVXLCDM\-]+)/gi,
    // Pattern: "Paragrafi X"
    /(?:Paragraf[ëit]*\s+\d+)/gi,
  ]
  
  lawPatterns.forEach(pattern => {
    const matches = content.matchAll(pattern)
    for (const match of matches) {
      const text = match[0].trim()
      
      // Avoid duplicates
      if (!lawReferences.some(ref => ref.text === text)) {
        lawReferences.push({
          lawName: extractLawName(text),
          article: extractArticle(text),
          text: text,
        })
      }
    }
  })
  
  return {
    sections,
    lawReferences: lawReferences.slice(0, 5), // Limit to 5 references
  }
}

/**
 * Extract law name from reference text
 */
function extractLawName(text: string): string {
  // Try to extract law code names
  const codeMatch = text.match(/Kod[iï]\s+(?:i|të)\s+([\wëçñö\s]+)/i)
  if (codeMatch) {
    return `Kodi i ${codeMatch[1].trim()}`
  }
  
  // Try to extract law numbers
  const lawMatch = text.match(/Ligj[ëit]*\s+(?:Nr\.\s*)?([\d\/\-]+)/i)
  if (lawMatch) {
    return `Ligji Nr. ${lawMatch[1]}`
  }
  
  return text
}

/**
 * Extract article number from reference text
 */
function extractArticle(text: string): string | undefined {
  const articleMatch = text.match(/Nen[eit]*\s+([\dIVXLCDM\-]+)/i)
  if (articleMatch) {
    return articleMatch[1]
  }
  return undefined
}

/**
 * Format text with markdown-like syntax (**, *, etc.)
 */
export function formatMarkdown(text: string): string {
  // Bold: **text** -> <strong>text</strong>
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  
  // Italic: *text* -> <em>text</em>
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>')
  
  // Code: `text` -> <code>text</code>
  text = text.replace(/`(.+?)`/g, '<code class="px-1 py-0.5 bg-slate-800 rounded text-cyan-400">$1</code>')
  
  return text
}

/**
 * Detect if response contains law references
 */
export function hasLawReferences(content: string): boolean {
  const patterns = [
    /Kod[iï]\s+(?:i|të)/i,
    /Ligj[ëit]*\s+Nr/i,
    /Nen[eit]*\s+\d+/i,
  ]
  
  return patterns.some(pattern => pattern.test(content))
}

/**
 * Extract references, disclaimer, and GZK links from content
 */
export function extractReferencesAndDisclaimer(content: string): {
  mainContent: string
  references: string[]
  disclaimer: string | null
  gzkLinks: Array<{ text: string; url: string }>
} {
  const references: string[] = []
  const gzkLinks: Array<{ text: string; url: string }> = []
  let disclaimer: string | null = null
  let mainContent = content

  console.log('🔍 Parsing content:', content.substring(0, 200) + '...')

  // Extract references section (with or without bold)
  const refMatch = content.match(/\*{0,2}Referenca:\*{0,2}\s*([\s\S]*?)(?=\n\n|Ky është|This is|$)/i)
  if (refMatch) {
    const refSection = refMatch[1]
    // Split by bullet points or newlines
    const refLines = refSection.split(/\n/).filter(line => {
      const trimmed = line.trim()
      return trimmed.startsWith('•') || trimmed.startsWith('-') || (trimmed.length > 0 && trimmed.includes('Ligji'))
    })
    refLines.forEach(line => {
      const cleanLine = line.replace(/^[•\-]\s*/, '').trim()
      if (cleanLine && cleanLine.length > 5) {
        references.push(cleanLine)
      }
    })
    // Remove from main content
    mainContent = mainContent.replace(refMatch[0], '')
  }

  // Extract GZK links
  const gzkPattern = /https?:\/\/gzk\.rks-gov\.net[^\s)]+/gi
  const gzkMatches = content.matchAll(gzkPattern)
  for (const match of gzkMatches) {
    const url = match[0]
    // Try to find descriptive text before the link
    const beforeLink = content.substring(Math.max(0, match.index! - 100), match.index!)
    const textMatch = beforeLink.match(/([^.!?\n]+)$/)?.[1]?.trim()
    
    gzkLinks.push({
      text: textMatch || 'Gazeta Zyrtare',
      url: url
    })
  }

  // Extract disclaimer (usually at the end) - capture full sentence
  const disclaimerPatterns = [
    /Ky është një informacion i përgjithshëm bazuar në ligjet publike[^.]*\.[^.]*\./i,
    /This is general information based on public laws[^.]*\.[^.]*\./i,
    /Ky është informacion i përgjithshëm ligjor[^.]*\.[^.]*\./i,
    /This is general legal information[^.]*\.[^.]*\./i,
    /Ky është informacion bazuar në ligjin[^.]*\.[^.]*\./i,
  ]

  for (const pattern of disclaimerPatterns) {
    const disclaimerMatch = content.match(pattern)
    if (disclaimerMatch) {
      disclaimer = disclaimerMatch[0].trim()
      // Remove from main content
      mainContent = mainContent.replace(disclaimerMatch[0], '').trim()
      break
    }
  }

  console.log('📚 Extracted references:', references)
  console.log('🔗 Extracted GZK links:', gzkLinks)
  console.log('ℹ️  Extracted disclaimer:', disclaimer)

  return {
    mainContent: mainContent.trim(),
    references,
    disclaimer,
    gzkLinks
  }
}
