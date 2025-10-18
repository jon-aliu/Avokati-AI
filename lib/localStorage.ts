/**
 * Local Storage Helper for Chat Sessions
 * This provides a fallback/backup solution for saving chats locally in the browser
 * while Firestore issues are being resolved
 */

import { ChatSession, ChatMessage } from './firestore'

const STORAGE_KEYS = {
  CHATS: 'avokati_ai_chats',
  CURRENT_CHAT: 'avokati_ai_current_chat',
  USER_CHATS: (userId: string) => `avokati_ai_chats_${userId}`,
}

/**
 * Save a chat session to localStorage
 * @param userId - User ID to associate the chat with
 * @param chatId - Unique chat ID
 * @param messages - Array of chat messages
 * @param title - Chat title
 */
export function saveChat(
  userId: string,
  chatId: string,
  messages: ChatMessage[],
  title: string
): void {
  try {
    const storageKey = STORAGE_KEYS.USER_CHATS(userId)
    const existingChats = getChats(userId)
    
    // Create chat data structure matching Firestore format
    const chatData = {
      id: chatId,
      title,
      messages,
      createdAt: existingChats[chatId]?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: existingChats[chatId]?.isPinned || false,
      shared: false,
    }
    
    // Update or add chat
    const updatedChats = {
      ...existingChats,
      [chatId]: chatData,
    }
    
    localStorage.setItem(storageKey, JSON.stringify(updatedChats))
    console.log('💾 Chat saved to localStorage:', {
      userId,
      chatId,
      title,
      messageCount: messages.length,
    })
  } catch (error) {
    console.error('❌ Error saving chat to localStorage:', error)
  }
}

/**
 * Get all chats for a user from localStorage
 * @param userId - User ID
 * @returns Object with chatId as key and chat data as value
 */
export function getChats(userId: string): { [chatId: string]: any } {
  try {
    const storageKey = STORAGE_KEYS.USER_CHATS(userId)
    const data = localStorage.getItem(storageKey)
    
    if (!data) {
      return {}
    }
    
    const chats = JSON.parse(data)
    console.log('📂 Loaded chats from localStorage:', {
      userId,
      chatCount: Object.keys(chats).length,
    })
    
    return chats
  } catch (error) {
    console.error('❌ Error loading chats from localStorage:', error)
    return {}
  }
}

/**
 * Get all chats as an array (for UI display)
 * @param userId - User ID
 * @returns Array of chat sessions sorted by updatedAt
 */
export function getChatsList(userId: string): ChatSession[] {
  try {
    const chatsObject = getChats(userId)
    
    // Convert object to array and sort by updatedAt (most recent first)
    const chatsList = Object.values(chatsObject)
      .map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }))
      .sort((a: any, b: any) => b.updatedAt.getTime() - a.updatedAt.getTime())
    
    return chatsList as ChatSession[]
  } catch (error) {
    console.error('❌ Error getting chats list from localStorage:', error)
    return []
  }
}

/**
 * Get a single chat by ID
 * @param userId - User ID
 * @param chatId - Chat ID
 * @returns Chat session or null
 */
export function getChat(userId: string, chatId: string): ChatSession | null {
  try {
    const chats = getChats(userId)
    const chat = chats[chatId]
    
    if (!chat) {
      return null
    }
    
    return {
      ...chat,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt),
      messages: chat.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    } as ChatSession
  } catch (error) {
    console.error('❌ Error getting chat from localStorage:', error)
    return null
  }
}

/**
 * Update a chat session
 * @param userId - User ID
 * @param chatId - Chat ID
 * @param updates - Partial chat data to update
 */
export function updateChat(
  userId: string,
  chatId: string,
  updates: Partial<ChatSession>
): void {
  try {
    const chats = getChats(userId)
    
    if (!chats[chatId]) {
      console.warn('⚠️ Chat not found for update:', chatId)
      return
    }
    
    chats[chatId] = {
      ...chats[chatId],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    
    const storageKey = STORAGE_KEYS.USER_CHATS(userId)
    localStorage.setItem(storageKey, JSON.stringify(chats))
    
    console.log('🔄 Chat updated in localStorage:', {
      userId,
      chatId,
      updates: Object.keys(updates),
    })
  } catch (error) {
    console.error('❌ Error updating chat in localStorage:', error)
  }
}

/**
 * Delete a chat session
 * @param userId - User ID
 * @param chatId - Chat ID
 */
export function deleteChat(userId: string, chatId: string): void {
  try {
    const chats = getChats(userId)
    
    if (!chats[chatId]) {
      console.warn('⚠️ Chat not found for deletion:', chatId)
      return
    }
    
    delete chats[chatId]
    
    const storageKey = STORAGE_KEYS.USER_CHATS(userId)
    localStorage.setItem(storageKey, JSON.stringify(chats))
    
    console.log('🗑️ Chat deleted from localStorage:', {
      userId,
      chatId,
    })
  } catch (error) {
    console.error('❌ Error deleting chat from localStorage:', error)
  }
}

/**
 * Toggle pin status for a chat
 * @param userId - User ID
 * @param chatId - Chat ID
 */
export function togglePin(userId: string, chatId: string): void {
  try {
    const chats = getChats(userId)
    
    if (!chats[chatId]) {
      console.warn('⚠️ Chat not found for pin toggle:', chatId)
      return
    }
    
    chats[chatId].isPinned = !chats[chatId].isPinned
    chats[chatId].updatedAt = new Date().toISOString()
    
    const storageKey = STORAGE_KEYS.USER_CHATS(userId)
    localStorage.setItem(storageKey, JSON.stringify(chats))
    
    console.log('📌 Chat pin toggled in localStorage:', {
      userId,
      chatId,
      isPinned: chats[chatId].isPinned,
    })
  } catch (error) {
    console.error('❌ Error toggling pin in localStorage:', error)
  }
}

/**
 * Rename a chat
 * @param userId - User ID
 * @param chatId - Chat ID
 * @param newTitle - New title for the chat
 */
export function renameChat(userId: string, chatId: string, newTitle: string): void {
  updateChat(userId, chatId, { title: newTitle })
}

/**
 * Clear all chats for a user
 * @param userId - User ID
 */
export function clearAllChats(userId: string): void {
  try {
    const storageKey = STORAGE_KEYS.USER_CHATS(userId)
    localStorage.removeItem(storageKey)
    console.log('🗑️ All chats cleared from localStorage for user:', userId)
  } catch (error) {
    console.error('❌ Error clearing chats from localStorage:', error)
  }
}

/**
 * Export all chats as JSON (for backup)
 * @param userId - User ID
 * @returns JSON string of all chats
 */
export function exportChats(userId: string): string {
  try {
    const chats = getChats(userId)
    return JSON.stringify(chats, null, 2)
  } catch (error) {
    console.error('❌ Error exporting chats:', error)
    return '{}'
  }
}

/**
 * Import chats from JSON (for restore)
 * @param userId - User ID
 * @param jsonData - JSON string of chats
 */
export function importChats(userId: string, jsonData: string): void {
  try {
    const chats = JSON.parse(jsonData)
    const storageKey = STORAGE_KEYS.USER_CHATS(userId)
    localStorage.setItem(storageKey, JSON.stringify(chats))
    console.log('📥 Chats imported to localStorage:', {
      userId,
      chatCount: Object.keys(chats).length,
    })
  } catch (error) {
    console.error('❌ Error importing chats:', error)
    throw new Error('Invalid JSON data')
  }
}

/**
 * Sync localStorage chats to Firestore
 * This can be called when Firestore is working again
 * @param userId - User ID
 * @param syncFunction - Function to sync a single chat to Firestore
 */
export async function syncToFirestore(
  userId: string,
  syncFunction: (chatId: string, chatData: any) => Promise<void>
): Promise<void> {
  try {
    const chats = getChats(userId)
    const chatIds = Object.keys(chats)
    
    console.log('🔄 Starting sync to Firestore:', {
      userId,
      chatCount: chatIds.length,
    })
    
    for (const chatId of chatIds) {
      await syncFunction(chatId, chats[chatId])
    }
    
    console.log('✅ All chats synced to Firestore')
  } catch (error) {
    console.error('❌ Error syncing to Firestore:', error)
    throw error
  }
}

/**
 * Get storage usage information
 * @param userId - User ID
 * @returns Storage info object
 */
export function getStorageInfo(userId: string): {
  chatCount: number
  totalSize: string
  sizeInBytes: number
} {
  try {
    const storageKey = STORAGE_KEYS.USER_CHATS(userId)
    const data = localStorage.getItem(storageKey) || '{}'
    const sizeInBytes = new Blob([data]).size
    const sizeInKB = (sizeInBytes / 1024).toFixed(2)
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2)
    
    const chats = JSON.parse(data)
    const chatCount = Object.keys(chats).length
    
    return {
      chatCount,
      totalSize: sizeInBytes < 1024 * 1024 ? `${sizeInKB} KB` : `${sizeInMB} MB`,
      sizeInBytes,
    }
  } catch (error) {
    console.error('❌ Error getting storage info:', error)
    return {
      chatCount: 0,
      totalSize: '0 KB',
      sizeInBytes: 0,
    }
  }
}
