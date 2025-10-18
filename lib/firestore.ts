import { 
  collection, 
  doc, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { Source } from './api'

export interface ChatMessage {
  id?: string
  type: 'user' | 'assistant'
  content: string
  sources?: Source[]
  confidence?: number
  timestamp: Timestamp | Date
}

export interface ChatSession {
  id?: string
  title: string
  messages: ChatMessage[]
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
  isPinned?: boolean
  shared?: boolean
  shareId?: string
}

/**
 * Save a new chat session to user's history subcollection with custom ID
 * Path: users/{userId}/history/{chatId}
 * @param chatId - Custom chat ID (if not provided, will be generated)
 * @param quiet - If true, suppress console logs for quiet mode
 */
export async function saveChatSession(
  userId: string,
  messages: Omit<ChatMessage, 'id' | 'timestamp'>[],
  title?: string,
  quiet: boolean = false,
  chatId?: string
): Promise<string> {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check your Firebase configuration.')
  }

  if (!userId) {
    throw new Error('User ID is required to save chat session')
  }

  // Generate chat ID if not provided
  const finalChatId = chatId || generateChatId()

  if (!quiet) {
    console.log('💾 Saving chat session:', { 
      userId, 
      chatId: finalChatId, 
      title, 
      messageCount: messages.length,
      path: `users/${userId}/history/${finalChatId}`
    })
  }

  const chatData: Omit<ChatSession, 'id'> = {
    title: title || `Chat ${new Date().toLocaleDateString()}`,
    messages: messages.map(msg => ({
      ...msg,
      timestamp: serverTimestamp() as Timestamp,
    })),
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
    isPinned: false,
    shared: false,
  }

  try {
    // Save to users/{userId}/history/{chatId} with custom ID
    const chatDocRef = doc(db, 'users', userId, 'history', finalChatId)
    await setDoc(chatDocRef, chatData)
    
    // Update the history object in user document with complete chat messages
    const userDocRef = doc(db, 'users', userId)
    const userDocSnap = await getDoc(userDocRef)
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data()
      const existingHistory = userData.history || {}
      
      // Build the message structure: {q1: {}, a1: {}, q2: {}, a2: {}}
      const chatMessages: { [key: string]: any } = {}
      let questionIndex = 1
      let answerIndex = 1
      
      messages.forEach((msg) => {
        if (msg.type === 'user') {
          chatMessages[`q${questionIndex}`] = {
            content: msg.content,
            timestamp: new Date().toISOString(),
          }
          questionIndex++
        } else if (msg.type === 'assistant') {
          chatMessages[`a${answerIndex}`] = {
            content: msg.content,
            confidence: msg.confidence,
            timestamp: new Date().toISOString(),
          }
          answerIndex++
        }
      })
      
      // Add metadata to the chat
      const chatEntry = {
        ...chatMessages,
        _meta: {
          title: chatData.title,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          messageCount: messages.length,
        }
      }
      
      // Update history object with the new chat
      const updatedHistory = {
        ...existingHistory,
        [finalChatId]: chatEntry
      }
      
      await updateDoc(userDocRef, {
        history: updatedHistory,
        updatedAt: serverTimestamp(),
      })
      
      if (!quiet) {
        console.log('✅ Chat added to user history:', {
          chatId: finalChatId,
          structure: Object.keys(chatMessages)
        })
      }
    }
    
    if (!quiet) {
      console.log('✅ Chat saved successfully:', {
        chatId: finalChatId,
        path: `users/${userId}/history/${finalChatId}`
      })
    }
    return finalChatId
  } catch (error) {
    console.error('❌ Error saving chat to Firestore:', error)
    console.error('❌ Error details:', {
      userId,
      chatId: finalChatId,
      path: `users/${userId}/history/${finalChatId}`,
      error: error instanceof Error ? error.message : String(error)
    })
    throw error
  }
}

/**
 * Get all chat sessions from user's history subcollection
 * Path: users/{userId}/history
 */
export async function getUserChats(userId: string): Promise<ChatSession[]> {
  if (!db) {
    console.warn('⚠️ Firestore is not initialized')
    return []
  }

  console.log('📥 Loading chats for user:', userId)

  try {
    const userHistoryRef = collection(db, 'users', userId, 'history')
    const q = query(userHistoryRef, orderBy('updatedAt', 'desc'))

    const querySnapshot = await getDocs(q)
    console.log('✅ Loaded', querySnapshot.docs.length, 'chats from Firestore')
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ChatSession[]
  } catch (error) {
    console.error('❌ Error loading chats from Firestore:', error)
    console.error('Error details:', error)
    return []
  }
}

/**
 * Get a single chat session from user's history
 * Path: users/{userId}/history/{chatId}
 */
export async function getChatSession(userId: string, chatId: string): Promise<ChatSession | null> {
  if (!db) {
    return null
  }

  try {
    const docRef = doc(db, 'users', userId, 'history', chatId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as ChatSession
    }

    return null
  } catch (error) {
    console.error('❌ Error getting chat session:', error)
    return null
  }
}

/**
 * Update chat session in user's history
 * Path: users/{userId}/history/{chatId}
 * @param quiet - If true, suppress console logs for quiet mode
 */
export async function updateChatSession(
  userId: string,
  chatId: string,
  updates: Partial<ChatSession>,
  quiet: boolean = false
): Promise<void> {
  if (!db) {
    throw new Error('Firestore is not initialized')
  }

  if (!userId || !chatId) {
    throw new Error('User ID and Chat ID are required to update chat session')
  }

  if (!quiet) {
    console.log('🔄 Updating chat:', {
      chatId,
      userId,
      path: `users/${userId}/history/${chatId}`
    })
  }

  try {
    const docRef = doc(db, 'users', userId, 'history', chatId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
    
    // Update the history object in user document
    const userDocRef = doc(db, 'users', userId)
    const userDocSnap = await getDoc(userDocRef)
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data()
      const history = userData.history || {}
      
      // If this chat exists in history, update it
      if (history[chatId]) {
        const updatedChatHistory = { ...history }
        
        // Update metadata
        if (updates.title) {
          updatedChatHistory[chatId]._meta = {
            ...updatedChatHistory[chatId]._meta,
            title: updates.title,
            lastUpdated: new Date().toISOString(),
          }
        }
        
        // If messages are being updated, rebuild the q/a structure
        if (updates.messages && Array.isArray(updates.messages)) {
          const chatMessages: { [key: string]: any } = {}
          let questionIndex = 1
          let answerIndex = 1
          
          updates.messages.forEach((msg: any) => {
            if (msg.type === 'user') {
              chatMessages[`q${questionIndex}`] = {
                content: msg.content,
                timestamp: new Date().toISOString(),
              }
              questionIndex++
            } else if (msg.type === 'assistant') {
              chatMessages[`a${answerIndex}`] = {
                content: msg.content,
                confidence: msg.confidence,
                timestamp: new Date().toISOString(),
              }
              answerIndex++
            }
          })
          
          updatedChatHistory[chatId] = {
            ...chatMessages,
            _meta: {
              ...updatedChatHistory[chatId]._meta,
              lastUpdated: new Date().toISOString(),
              messageCount: updates.messages.length,
            }
          }
        }
        
        await updateDoc(userDocRef, {
          history: updatedChatHistory,
          updatedAt: serverTimestamp(),
        })
        
        if (!quiet) {
          console.log('✅ Chat history object updated')
        }
      }
    }
    
    if (!quiet) {
      console.log('✅ Chat updated successfully:', {
        chatId,
        path: `users/${userId}/history/${chatId}`
      })
    }
  } catch (error) {
    console.error('❌ Error updating chat:', error)
    console.error('❌ Error details:', {
      userId,
      chatId,
      path: `users/${userId}/history/${chatId}`,
      error: error instanceof Error ? error.message : String(error)
    })
    throw error
  }
}

/**
 * Delete chat session from user's history
 * Path: users/{userId}/history/{chatId}
 */
export async function deleteChatSession(userId: string, chatId: string): Promise<void> {
  if (!db) {
    throw new Error('Firestore is not initialized')
  }

  console.log('🗑️ Deleting chat:', chatId, 'for user:', userId)

  try {
    // Delete the chat document
    const docRef = doc(db, 'users', userId, 'history', chatId)
    await deleteDoc(docRef)
    
    // Remove chat from the history object in user document
    const userDocRef = doc(db, 'users', userId)
    const userDocSnap = await getDoc(userDocRef)
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data()
      const history = userData.history || {}
      
      // Remove the chat from history object
      const updatedHistory = { ...history }
      delete updatedHistory[chatId]
      
      await updateDoc(userDocRef, {
        history: updatedHistory,
        updatedAt: serverTimestamp(),
      })
      
      console.log('✅ Chat removed from history object')
    }
    
    console.log('✅ Chat deleted successfully')
  } catch (error) {
    console.error('❌ Error deleting chat:', error)
    throw error
  }
}

/**
 * Share a chat (generate share ID)
 */
export async function shareChat(userId: string, chatId: string): Promise<string> {
  const shareId = generateShareId()
  await updateChatSession(userId, chatId, {
    shared: true,
    shareId,
  })
  return shareId
}

/**
 * Get shared chat by share ID
 * Note: This requires a collection group query across all users' history
 */
export async function getSharedChat(shareId: string): Promise<ChatSession | null> {
  if (!db) {
    return null
  }

  try {
    // This would require a collection group query, which needs an index
    // For now, we'll implement a simpler version with a dedicated shares collection
    const q = query(
      collection(db, 'sharedChats'),
      where('shareId', '==', shareId),
      where('shared', '==', true)
    )

    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null

    const doc = querySnapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data(),
    } as ChatSession
  } catch (error) {
    console.error('❌ Error getting shared chat:', error)
    return null
  }
}

/**
 * Unshare a chat
 */
export async function unshareChat(userId: string, chatId: string): Promise<void> {
  await updateChatSession(userId, chatId, {
    shared: false,
    shareId: undefined,
  })
}

/**
 * Generate a unique chat ID for new chats
 * Format: {timestamp}-{random}
 * Example: 1729234567890-a7b8c9d
 */
export function generateChatId(): string {
  const timestamp = Date.now()
  const randomPart = Math.random().toString(36).substring(2, 9)
  return `${timestamp}-${randomPart}`
}

/**
 * Generate a random share ID for sharing chats
 * Format: {random}-{random}
 * Example: xj4k2m9p-h5n8q3r
 */
function generateShareId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

/**
 * Create a new user document with empty history
 * This should be called after successful email verification
 */
export async function createUserDocument(
  userId: string,
  email: string,
  displayName?: string | null
): Promise<void> {
  if (!db) {
    throw new Error('Firestore is not initialized')
  }

  console.log('👤 Creating user document:', { 
    userId, 
    email, 
    displayName,
    path: `users/${userId}` 
  })

  try {
    const userDocRef = doc(db, 'users', userId)
    
    // Check if user document already exists
    const userDocSnap = await getDoc(userDocRef)
    
    if (!userDocSnap.exists()) {
      // Create new user document with the userId as the document ID
      await setDoc(userDocRef, {
        email,
        displayName: displayName || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        questionCount: 0,
        isPremium: true, // Set all users as premium until payment method is implemented
        history: {}, // Initialize with empty object to store chats: {chatId: {q1:{}, a1:{}, ...}}
      })
      
      console.log('✅ User document created successfully:', {
        userId,
        path: `users/${userId}`,
        isPremium: true,
        history: 'initialized as object'
      })
    } else {
      console.log('ℹ️ User document already exists:', {
        userId,
        path: `users/${userId}`
      })
      
      // Update existing users to premium if not already set
      const userData = userDocSnap.data()
      const updates: any = {}
      
      if (userData.isPremium === false || userData.isPremium === undefined) {
        updates.isPremium = true
      }
      
      // Add history field if it doesn't exist
      if (!userData.history) {
        updates.history = {}
      }
      
      if (Object.keys(updates).length > 0) {
        updates.updatedAt = serverTimestamp()
        await updateDoc(userDocRef, updates)
        console.log('✅ Updated existing user:', updates)
      }
    }
  } catch (error) {
    console.error('❌ Error creating user document:', error)
    console.error('❌ Error details:', {
      userId,
      email,
      path: `users/${userId}`,
      error: error instanceof Error ? error.message : String(error)
    })
    throw error
  }
}

/**
 * Verify that a user document exists in Firestore
 * Returns true if the user document exists
 */
export async function verifyUserDocument(userId: string): Promise<boolean> {
  if (!db) {
    console.warn('⚠️ Firestore is not initialized')
    return false
  }

  try {
    const userDocRef = doc(db, 'users', userId)
    const userDocSnap = await getDoc(userDocRef)
    const exists = userDocSnap.exists()
    
    console.log('🔍 User document verification:', {
      userId,
      exists,
      path: `users/${userId}`
    })
    
    return exists
  } catch (error) {
    console.error('❌ Error verifying user document:', error)
    return false
  }
}

/**
 * Get the chat history object from user document
 * Returns the complete history object: {chatId: {q1:{}, a1:{}, q2:{}, a2:{}, _meta:{}}}
 */
export async function getChatHistoryObject(userId: string): Promise<{ [chatId: string]: any }> {
  if (!db) {
    console.warn('⚠️ Firestore is not initialized')
    return {}
  }

  try {
    const userDocRef = doc(db, 'users', userId)
    const userDocSnap = await getDoc(userDocRef)
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data()
      const history = userData.history || {}
      
      console.log('📋 Chat history object loaded:', {
        userId,
        chatCount: Object.keys(history).length,
        chatIds: Object.keys(history)
      })
      
      return history
    }
    
    return {}
  } catch (error) {
    console.error('❌ Error getting chat history object:', error)
    return {}
  }
}

/**
 * Get the chat history list (metadata only) from user document
 * Returns array of chat metadata for easier display
 */
export async function getChatHistoryList(userId: string): Promise<Array<{
  id: string
  title: string
  createdAt: string
  lastUpdated: string
  messageCount: number
}>> {
  if (!db) {
    console.warn('⚠️ Firestore is not initialized')
    return []
  }

  try {
    const history = await getChatHistoryObject(userId)
    
    // Extract metadata from each chat
    const chatList = Object.entries(history).map(([chatId, chatData]) => ({
      id: chatId,
      title: chatData._meta?.title || 'Untitled Chat',
      createdAt: chatData._meta?.createdAt || new Date().toISOString(),
      lastUpdated: chatData._meta?.lastUpdated || new Date().toISOString(),
      messageCount: chatData._meta?.messageCount || 0,
    }))
    
    // Sort by lastUpdated (most recent first)
    chatList.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    
    console.log('📋 Chat history list extracted:', {
      chatCount: chatList.length
    })
    
    return chatList
  } catch (error) {
    console.error('❌ Error getting chat history list:', error)
    return []
  }
}

/**
 * Get user document
 */
export async function getUserDocument(userId: string): Promise<any | null> {
  if (!db) {
    return null
  }

  try {
    const userDocRef = doc(db, 'users', userId)
    const userDocSnap = await getDoc(userDocRef)

    if (userDocSnap.exists()) {
      return {
        id: userDocSnap.id,
        ...userDocSnap.data(),
      }
    }

    return null
  } catch (error) {
    console.error('❌ Error getting user document:', error)
    return null
  }
}

/**
 * Track user question count (for free tier limit)
 */
export async function getUserQuestionCount(userId: string): Promise<number> {
  const docRef = doc(db, 'users', userId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data().questionCount || 0
  }

  return 0
}

/**
 * Increment user question count
 */
export async function incrementQuestionCount(userId: string): Promise<number> {
  if (!db) {
    return 0
  }

  const docRef = doc(db, 'users', userId)
  const docSnap = await getDoc(docRef)

  let newCount = 1

  try {
    if (docSnap.exists()) {
      newCount = (docSnap.data().questionCount || 0) + 1
      await updateDoc(docRef, {
        questionCount: newCount,
        lastQuestionAt: serverTimestamp(),
      })
    } else {
      // If user document doesn't exist, create it
      await addDoc(collection(db, 'users'), {
        userId,
        questionCount: 1,
        createdAt: serverTimestamp(),
        lastQuestionAt: serverTimestamp(),
      })
    }

    return newCount
  } catch (error) {
    console.error('❌ Error incrementing question count:', error)
    return 0
  }
}

/**
 * Delete all user data from Firestore
 * This includes the user document and all chat history
 * Path: users/{userId} and all subcollections
 * 
 * IMPORTANT: This should be called when a user deletes their account
 */
export async function deleteUserData(userId: string): Promise<void> {
  if (!db) {
    throw new Error('Firestore is not initialized')
  }

  if (!userId) {
    throw new Error('User ID is required to delete user data')
  }

  console.log('🗑️ Starting deletion of all user data:', {
    userId,
    path: `users/${userId}`
  })

  try {
    // Step 1: Delete all chats in the history subcollection
    const historyRef = collection(db, 'users', userId, 'history')
    const historySnapshot = await getDocs(historyRef)
    
    console.log(`📦 Found ${historySnapshot.size} chats to delete`)

    // Delete each chat document
    const deletePromises = historySnapshot.docs.map(async (chatDoc) => {
      await deleteDoc(chatDoc.ref)
      console.log(`✅ Deleted chat: ${chatDoc.id}`)
    })

    await Promise.all(deletePromises)
    console.log('✅ All chat history deleted')

    // Step 2: Delete the user document
    const userDocRef = doc(db, 'users', userId)
    await deleteDoc(userDocRef)
    console.log('✅ User document deleted')

    console.log('🎉 All user data successfully deleted from Firestore')
  } catch (error) {
    console.error('❌ Error deleting user data from Firestore:', error)
    console.error('❌ Error details:', {
      userId,
      path: `users/${userId}`,
      error: error instanceof Error ? error.message : String(error)
    })
    throw error
  }
}
