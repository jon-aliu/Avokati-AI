'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  HiDotsVertical,
  HiPencil,
  HiTrash,
  HiStar,
  HiOutlineStar,
} from 'react-icons/hi'
import { ChatSession, Language } from './types'

interface ChatListItemProps {
  chat: ChatSession
  isActive: boolean
  language: Language
  onSelect: () => void
  onPin: () => void
  onDelete: () => void
  onRename: (newTitle: string) => void
}

export function ChatListItem({
  chat,
  isActive,
  language,
  onSelect,
  onPin,
  onDelete,
  onRename,
}: ChatListItemProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [newTitle, setNewTitle] = useState(chat.title)
  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  // Focus input when renaming
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isRenaming])

  const handleRenameSubmit = () => {
    if (newTitle.trim() && newTitle !== chat.title) {
      onRename(newTitle.trim())
    }
    setIsRenaming(false)
    setNewTitle(chat.title)
  }

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit()
    } else if (e.key === 'Escape') {
      setIsRenaming(false)
      setNewTitle(chat.title)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`group relative rounded-lg transition-all ${
        isActive
          ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30'
          : 'hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-start gap-2 p-3">
        {/* Main Content - Clickable */}
        <button
          onClick={onSelect}
          className="flex-1 text-left min-w-0"
        >
          {/* Title or Rename Input */}
          {isRenaming ? (
            <input
              ref={inputRef}
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleRenameKeyDown}
              className="w-full px-2 py-1 bg-slate-700 border border-cyan-500/50 rounded text-sm text-white focus:outline-none focus:border-cyan-400"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="flex items-start gap-2">
              {chat.isPinned && (
                <HiStar className="w-3 h-3 text-yellow-400 shrink-0 mt-0.5" />
              )}
              <h3
                className={`text-sm font-medium line-clamp-2 ${
                  isActive ? 'text-white' : 'text-slate-200'
                }`}
              >
                {chat.title}
              </h3>
            </div>
          )}

          {/* Preview */}
          {!isRenaming && (
            <p className="text-xs text-slate-400 truncate mt-1">
              {chat.lastMessage || (language === 'en' ? 'No messages yet' : 'Ende pa mesazhe')}
            </p>
          )}

          {/* Timestamp */}
          {!isRenaming && (
            <p className="text-xs text-slate-500 mt-1">
              {new Date(chat.timestamp).toLocaleDateString()}
            </p>
          )}
        </button>

        {/* Menu Button */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className={`p-1 rounded hover:bg-slate-700/50 transition-colors ${
              showMenu ? 'bg-slate-700/50' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <HiDotsVertical className="w-4 h-4 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 top-8 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-2xl overflow-hidden z-50 min-w-[160px]"
            >
              {/* Pin/Unpin */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onPin()
                  setShowMenu(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/50 transition-colors text-left"
              >
                {chat.isPinned ? (
                  <HiOutlineStar className="w-4 h-4 text-slate-400" />
                ) : (
                  <HiStar className="w-4 h-4 text-yellow-400" />
                )}
                <span className="text-sm text-slate-200">
                  {chat.isPinned
                    ? language === 'en'
                      ? 'Unpin'
                      : 'Hiq nga të fiksuarat'
                    : language === 'en'
                    ? 'Pin'
                    : 'Fikso'}
                </span>
              </button>

              {/* Rename */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsRenaming(true)
                  setShowMenu(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/50 transition-colors text-left"
              >
                <HiPencil className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-200">
                  {language === 'en' ? 'Rename' : 'Riemërto'}
                </span>
              </button>

              {/* Divider */}
              <div className="border-t border-slate-700/50" />

              {/* Delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                  setShowMenu(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors text-left group/delete"
              >
                <HiTrash className="w-4 h-4 text-red-400 group-hover/delete:text-red-300" />
                <span className="text-sm text-red-400 group-hover/delete:text-red-300">
                  {language === 'en' ? 'Delete' : 'Fshi'}
                </span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
