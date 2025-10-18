'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiPlus, HiSearch, HiScale, HiChevronRight, HiChevronLeft } from 'react-icons/hi'
import { ChatSession, Language } from './types'
import { ChatListItem } from './ChatListItem'
import { UserProfile } from './UserProfile'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onOpen?: () => void
  language: Language
  chatSessions: ChatSession[]
  currentChatId: string | null
  searchQuery: string
  onSearchChange: (query: string) => void
  onCreateNewChat: () => void
  onSelectChat: (chat: ChatSession) => void
  onTogglePin: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  onRenameChat: (chatId: string, newTitle: string) => void
  user: {
    email: string | null
    displayName: string | null
  }
  onLogout: () => void
}

export function Sidebar({
  isOpen,
  onClose,
  onOpen,
  language,
  chatSessions,
  currentChatId,
  searchQuery,
  onSearchChange,
  onCreateNewChat,
  onSelectChat,
  onTogglePin,
  onDeleteChat,
  onRenameChat,
  user,
  onLogout,
}: SidebarProps) {
  // Filter and sort chats
  const filteredChats = chatSessions.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pinnedChats = filteredChats.filter((chat) => chat.isPinned)
  const regularChats = filteredChats.filter((chat) => !chat.isPinned)

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800/50">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <HiScale className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-display font-bold text-white">
            Avokati AI
          </h2>
          
          {/* Toggle Button (Desktop) */}
          {onClose && (
            <button
              onClick={onClose}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-800/50 transition-colors ml-auto"
              aria-label="Close sidebar"
            >
              <HiChevronLeft className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
            </button>
          )}
        </div>

        {/* Close Button (Mobile) */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          aria-label="Close sidebar"
        >
          <HiX className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-4 py-3">
        <button
          onClick={() => {
            onCreateNewChat()
            if (window.innerWidth < 1024) {
              onClose()
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
        >
          <HiPlus className="w-5 h-5" />
          <span>{language === 'en' ? 'New Chat' : 'Bisedë e Re'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-3">
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={language === 'en' ? 'Search chats...' : 'Kërko biseda...'}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4">
        {/* Pinned Chats */}
        {pinnedChats.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 px-1">
              {language === 'en' ? 'Pinned' : 'Të fiksuarat'}
            </h3>
            <div className="space-y-2">
              {pinnedChats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === currentChatId}
                  language={language}
                  onSelect={() => {
                    onSelectChat(chat)
                    if (window.innerWidth < 1024) {
                      onClose()
                    }
                  }}
                  onPin={() => onTogglePin(chat.id)}
                  onDelete={() => onDeleteChat(chat.id)}
                  onRename={(newTitle) => onRenameChat(chat.id, newTitle)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Chats */}
        {regularChats.length > 0 && (
          <div>
            {pinnedChats.length > 0 && (
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 px-1">
                {language === 'en' ? 'All Chats' : 'Të gjitha bisedat'}
              </h3>
            )}
            <div className="space-y-2">
              {regularChats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === currentChatId}
                  language={language}
                  onSelect={() => {
                    onSelectChat(chat)
                    if (window.innerWidth < 1024) {
                      onClose()
                    }
                  }}
                  onPin={() => onTogglePin(chat.id)}
                  onDelete={() => onDeleteChat(chat.id)}
                  onRename={(newTitle) => onRenameChat(chat.id, newTitle)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredChats.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-slate-500">
              {searchQuery
                ? language === 'en'
                  ? 'No chats found'
                  : 'Nuk u gjetën biseda'
                : language === 'en'
                ? 'No chats yet'
                : 'Ende pa biseda'}
            </p>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="border-t border-slate-800/50 p-4">
        <UserProfile user={user} language={language} onLogout={onLogout} />
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -320,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="lg:hidden fixed top-0 left-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 flex flex-col z-50"
      >
        <SidebarContent />
      </motion.aside>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 320 : 0,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="hidden lg:flex h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 flex-col overflow-hidden"
      >
        <div className="w-80 h-full flex flex-col">
          <SidebarContent />
        </div>
      </motion.aside>

      {/* Floating Open Button (Desktop - when sidebar is closed) */}
      <AnimatePresence>
        {onOpen && !isOpen && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={onOpen}
            className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 w-8 h-16 bg-slate-800/90 hover:bg-slate-700/90 backdrop-blur-xl border-r border-t border-b border-slate-700/50 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 rounded-r-lg shadow-lg transition-all z-40"
            aria-label="Open sidebar"
          >
            <div className="w-full h-full flex items-center justify-center">
              <HiChevronRight className="w-5 h-5" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
