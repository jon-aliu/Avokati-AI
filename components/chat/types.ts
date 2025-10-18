// Chat Types and Interfaces

export type Language = 'en' | 'al'

export interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  confidence?: number
  timestamp: Date
  isLawRelated?: boolean
}

export interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  isPinned: boolean
  messages: Message[]
}
