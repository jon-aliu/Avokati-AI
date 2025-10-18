'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Timestamp } from 'firebase/firestore'
import { useAuth } from '@/lib/contexts/AuthContext'
import { getGroqResponse, isGroqConfigured } from '@/lib/groq'
import { Language, Message, ChatSession } from './types'
import { Sidebar } from './Sidebar'
import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import {
  getUserChats,
  saveChatSession,
  updateChatSession,
  deleteChatSession,
  getChatSession,
  generateChatId,
  verifyUserDocument,
  createUserDocument,
} from '@/lib/firestore'
import * as LocalStorage from '@/lib/localStorage'

export default function LoggedInChat() {
  const router = useRouter()
  const { user, logout } = useAuth()

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [language, setLanguage] = useState<Language>('al')
  const [searchQuery, setSearchQuery] = useState('')

  // Chat State
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiReady, setApiReady] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

  // Load chat sessions from localStorage (with Firestore as backup)
  useEffect(() => {
    const loadChats = async () => {
      if (!user?.uid || !user?.email) {
        console.log('⚠️ No user logged in, skipping chat load')
        return
      }

      console.log('📂 Starting to load chats for user:', {
        userId: user.uid,
        userEmail: user.email,
        emailVerified: user.emailVerified
      })

      try {
        // Load from localStorage first (instant load)
        const localChats = LocalStorage.getChatsList(user.uid)
        
        if (localChats.length > 0) {
          console.log('✅ Loaded from localStorage:', localChats.length, 'chats')
          const sessions: ChatSession[] = localChats.map((chat) => ({
            id: chat.id || Date.now().toString(),
            title: chat.title,
            lastMessage: chat.messages[chat.messages.length - 1]?.content || '',
            timestamp: chat.updatedAt instanceof Date ? chat.updatedAt : new Date(),
            isPinned: chat.isPinned || false,
            messages: chat.messages.map((msg) => ({
              id: msg.id || `msg-${Date.now()}`,
              type: msg.type,
              content: msg.content,
              confidence: msg.confidence,
              timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(),
              isLawRelated: true,
            })),
          }))
          setChatSessions(sessions)
        } else {
          console.log('ℹ️ No chats in localStorage, trying Firestore...')
        }

        // Try Firestore in background (don't block UI)
        try {
          const userExists = await verifyUserDocument(user.uid)
          if (!userExists) {
            console.log('⚠️ User document not found, creating...')
            await createUserDocument(user.uid, user.email, user.displayName)
            console.log('✅ User document created')
          }

          const chats = await getUserChats(user.uid)
          console.log('📦 Raw chats from Firestore:', chats)
          
          if (chats.length > 0) {
            const sessions: ChatSession[] = chats.map((chat) => ({
              id: chat.id || Date.now().toString(),
              title: chat.title,
              lastMessage: chat.messages[chat.messages.length - 1]?.content || '',
              timestamp: chat.updatedAt instanceof Date ? chat.updatedAt : chat.updatedAt?.toDate() || new Date(),
              isPinned: chat.isPinned || false,
              messages: chat.messages.map((msg) => ({
                id: msg.id || `msg-${Date.now()}`,
                type: msg.type,
                content: msg.content,
                confidence: msg.confidence,
                timestamp: msg.timestamp instanceof Date ? msg.timestamp : msg.timestamp?.toDate() || new Date(),
                isLawRelated: true,
              })),
            }))
            
            console.log('✅ Processed sessions from Firestore:', sessions.length, 'chats loaded')
            setChatSessions(sessions)
            
            // Save to localStorage for next time
            sessions.forEach(session => {
              LocalStorage.saveChat(user.uid, session.id, session.messages as any, session.title)
            })
          }
        } catch (firestoreError) {
          console.warn('⚠️ Firestore load failed, using localStorage only:', firestoreError)
          if (localChats.length === 0) {
            toast(
              language === 'en'
                ? 'Using offline mode - chats saved locally'
                : 'Duke përdorur mënyrën offline - bisedat ruhen lokalisht',
              { icon: '💾', duration: 3000 }
            )
          }
        }
      } catch (error) {
        console.error('❌ Error loading chat sessions:', error)
        toast.error(
          language === 'en'
            ? 'Failed to load chat history'
            : 'Dështoi ngarkimi i historisë së bisedave'
        )
      }
    }

    loadChats()
  }, [user, language])

  // Auto-save current chat when it changes (debounced)
  useEffect(() => {
    if (!currentChat || !currentChat.messages.length || isSaving) return
    
    // Debounce auto-save by 2 seconds
    const timeoutId = setTimeout(async () => {
      if (currentChat.messages.length > 0) {
        setIsSaving(true)
        await saveChat(currentChat, true) // Quiet mode
        setIsSaving(false)
      }
    }, 2000)

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat, isSaving])

  // Save chat session to localStorage (with Firestore backup)
  const saveChat = useCallback(async (session: ChatSession, quiet: boolean = true) => {
    if (!user?.uid) {
      console.error('⚠️ Cannot save chat: No user logged in')
      return
    }

    if (!session.id) {
      console.error('⚠️ Cannot save chat: No session ID')
      return
    }

    if (!quiet) {
      console.log('💾 Attempting to save chat:', {
        sessionId: session.id,
        title: session.title,
        messageCount: session.messages.length,
        userId: user.uid,
        userEmail: user.email,
      })
    }

    try {
      // ALWAYS save to localStorage first (instant, reliable)
      LocalStorage.saveChat(
        user.uid,
        session.id,
        session.messages as any,
        session.title
      )
      
      if (!quiet) {
        console.log('✅ Chat saved to localStorage')
      }

      // Try to save to Firestore in background (don't block UI)
      try {
        const messages = session.messages.map((msg) => ({
          type: msg.type,
          content: msg.content,
          confidence: msg.confidence,
        }))

        // Check if chat already exists in Firestore
        const existingChat = chatSessions.find(c => c.id === session.id)
        const isNewChat = !existingChat || existingChat.messages.length === 0

        if (!isNewChat && session.id) {
          // Existing chat - update (quiet mode)
          if (!quiet) console.log('🔄 Updating existing chat in Firestore...')
          await updateChatSession(user.uid, session.id, {
            title: session.title,
            messages: messages as any,
          }, quiet)
        } else {
          // New chat - create with the session's ID (quiet mode)
          if (!quiet) console.log('➕ Creating new chat in Firestore...')
          await saveChatSession(user.uid, messages, session.title, quiet, session.id)
          if (!quiet) console.log('✅ New chat created in Firestore with ID:', session.id)
        }
      } catch (firestoreError) {
        // Firestore failed, but localStorage succeeded
        console.warn('⚠️ Firestore save failed, but chat is saved locally:', firestoreError)
        // Don't show error - localStorage backup is working
      }
    } catch (error) {
      console.error('❌ Error saving chat:', error)
      console.error('❌ Error context:', {
        userId: user.uid,
        userEmail: user.email,
        sessionId: session.id,
        messageCount: session.messages.length,
      })
      // Only show error if localStorage also failed
      if (!quiet) {
        toast.error(
          language === 'en'
            ? 'Failed to save chat'
            : 'Dështoi ruajtja e bisedës'
        )
      }
    }
  }, [user, chatSessions, language])

  // Create new chat
  const createNewChat = () => {
    // Generate a unique chat ID for sharing feature
    const chatId = generateChatId()
    
    const newChat: ChatSession = {
      id: chatId, // Use generated ID instead of temp
      title: language === 'en' ? 'New Chat' : 'Bisedë e Re',
      lastMessage: '',
      timestamp: new Date(),
      isPinned: false,
      messages: [],
    }
    setCurrentChat(newChat)
    setChatSessions([newChat, ...chatSessions])
  }

  // Select chat
  const selectChat = (chat: ChatSession) => {
    setCurrentChat(chat)
    setInput('')
  }

  // Toggle pin
  const togglePin = (chatId: string) => {
    if (!user?.uid) return

    const updated = chatSessions.map((chat) =>
      chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
    )
    setChatSessions(updated)

    if (currentChat?.id === chatId) {
      setCurrentChat({ ...currentChat, isPinned: !currentChat.isPinned })
    }

    // Save to localStorage
    LocalStorage.togglePin(user.uid, chatId)

    // Try Firestore in background
    updateChatSession(user.uid, chatId, { 
      isPinned: updated.find(c => c.id === chatId)?.isPinned 
    }).catch(err => console.warn('⚠️ Firestore update failed:', err))

    toast.success(language === 'en' ? 'Chat updated' : 'Biseda u përditësua')
  }

  // Delete chat
  const deleteChat = async (chatId: string) => {
    if (!user?.uid) return

    try {
      // Delete from localStorage first
      LocalStorage.deleteChat(user.uid, chatId)

      const updated = chatSessions.filter((chat) => chat.id !== chatId)
      setChatSessions(updated)

      if (currentChat?.id === chatId) {
        setCurrentChat(null)
      }

      // Try Firestore in background
      deleteChatSession(user.uid, chatId).catch(err => 
        console.warn('⚠️ Firestore delete failed:', err)
      )

      toast.success(language === 'en' ? 'Chat deleted' : 'Biseda u fshi')
    } catch (error) {
      console.error('Error deleting chat:', error)
      toast.error(
        language === 'en'
          ? 'Failed to delete chat'
          : 'Dështoi fshirja e bisedës'
      )
    }
  }

  // Rename chat
  const renameChat = async (chatId: string, newTitle: string) => {
    if (!user?.uid) return

    try {
      // Update localStorage first
      LocalStorage.renameChat(user.uid, chatId, newTitle)

      const updated = chatSessions.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
      setChatSessions(updated)

      if (currentChat?.id === chatId) {
        setCurrentChat({ ...currentChat, title: newTitle })
      }

      // Try Firestore in background
      updateChatSession(user.uid, chatId, { title: newTitle }).catch(err => 
        console.warn('⚠️ Firestore update failed:', err)
      )
    } catch (error) {
      console.error('Error renaming chat:', error)
      toast.error(
        language === 'en'
          ? 'Failed to rename chat'
          : 'Dështoi riemërtimi i bisedës'
      )
    }
  }

  // Handle suggested question
  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    // Optionally auto-submit
    // handleSubmit()
  }

  // Handle message submission
  const handleSubmit = async () => {
    if (!input.trim() || isLoading || !apiReady) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    // Create or update current chat
    let updatedChat: ChatSession
    if (!currentChat) {
      // Generate a unique chat ID for new chat
      const chatId = generateChatId()
      
      updatedChat = {
        id: chatId,
        title: input.trim().slice(0, 50) + (input.length > 50 ? '...' : ''),
        lastMessage: input.trim(),
        timestamp: new Date(),
        isPinned: false,
        messages: [userMessage],
      }
      setCurrentChat(updatedChat)
    } else {
      updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, userMessage],
        lastMessage: input.trim(),
        timestamp: new Date(),
      }
      setCurrentChat(updatedChat)
    }

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

      const finalChat: ChatSession = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistantMessage],
        lastMessage: response.answer.slice(0, 100),
      }

      setCurrentChat(finalChat)

      // Save to Firestore
      await saveChat(finalChat)

      // Update local state
      const existingIndex = chatSessions.findIndex((c) => c.id === finalChat.id)
      if (existingIndex >= 0) {
        const updated = [...chatSessions]
        updated[existingIndex] = finalChat
        setChatSessions(updated)
      } else {
        setChatSessions([finalChat, ...chatSessions])
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

  // Share chat
  const shareChat = () => {
    if (!currentChat) return

    const shareUrl = `${window.location.origin}/shared/${currentChat.id}`
    navigator.clipboard.writeText(shareUrl)
    toast.success(language === 'en' ? 'Link copied!' : 'Linku u kopjua!')
  }

  // Logout
  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error(language === 'en' ? 'Logout failed' : 'Dalja dështoi')
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpen={() => setSidebarOpen(true)}
        language={language}
        chatSessions={chatSessions}
        currentChatId={currentChat?.id || null}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateNewChat={createNewChat}
        onSelectChat={selectChat}
        onTogglePin={togglePin}
        onDeleteChat={deleteChat}
        onRenameChat={renameChat}
        user={{
          email: user.email,
          displayName: user.displayName,
        }}
        onLogout={handleLogout}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full w-full relative">
        <ChatHeader
          currentChat={currentChat}
          language={language}
          onLanguageChange={setLanguage}
          onToggleSidebar={() => setSidebarOpen(true)}
          onTogglePin={currentChat ? () => togglePin(currentChat.id) : undefined}
          onShare={currentChat ? shareChat : undefined}
          isLoading={isLoading}
          isSaving={isSaving}
        />

        <MessageList
          messages={currentChat?.messages || []}
          language={language}
          isLoading={isLoading}
          onSuggestedQuestion={handleSuggestedQuestion}
          userInfo={{
            email: user.email,
            displayName: user.displayName,
          }}
        />

        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isDisabled={!apiReady}
          language={language}
        />
      </div>
    </div>
  )
}
