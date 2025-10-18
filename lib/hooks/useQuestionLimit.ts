'use client'

import { useState, useEffect } from 'react'

const FREE_QUESTION_LIMIT = 3
const STORAGE_KEY = 'avokati_question_count'
const TIMESTAMP_KEY = 'avokati_question_timestamp'
const RESET_HOURS = 24

export function useQuestionLimit() {
  const [questionCount, setQuestionCount] = useState(0)
  const [hasReachedLimit, setHasReachedLimit] = useState(false)
  const [timeUntilReset, setTimeUntilReset] = useState<number | null>(null)

  useEffect(() => {
    // Check if 24 hours have passed
    const storedTimestamp = localStorage.getItem(TIMESTAMP_KEY)
    const storedCount = localStorage.getItem(STORAGE_KEY)
    
    if (storedTimestamp) {
      const timestamp = parseInt(storedTimestamp, 10)
      const now = Date.now()
      const hoursPassed = (now - timestamp) / (1000 * 60 * 60)
      
      // Reset if 24 hours have passed
      if (hoursPassed >= RESET_HOURS) {
        localStorage.setItem(STORAGE_KEY, '0')
        localStorage.setItem(TIMESTAMP_KEY, now.toString())
        setQuestionCount(0)
        setHasReachedLimit(false)
        setTimeUntilReset(RESET_HOURS * 60 * 60 * 1000)
      } else {
        // Load existing count
        const count = storedCount ? parseInt(storedCount, 10) : 0
        setQuestionCount(count)
        setHasReachedLimit(count >= FREE_QUESTION_LIMIT)
        
        // Calculate time until reset
        const msUntilReset = (RESET_HOURS * 60 * 60 * 1000) - (now - timestamp)
        setTimeUntilReset(msUntilReset)
      }
    } else {
      // First time user
      const now = Date.now()
      localStorage.setItem(TIMESTAMP_KEY, now.toString())
      localStorage.setItem(STORAGE_KEY, '0')
      setTimeUntilReset(RESET_HOURS * 60 * 60 * 1000)
    }

    // Update countdown every minute
    const interval = setInterval(() => {
      const storedTimestamp = localStorage.getItem(TIMESTAMP_KEY)
      if (storedTimestamp) {
        const timestamp = parseInt(storedTimestamp, 10)
        const now = Date.now()
        const hoursPassed = (now - timestamp) / (1000 * 60 * 60)
        
        if (hoursPassed >= RESET_HOURS) {
          // Auto reset
          localStorage.setItem(STORAGE_KEY, '0')
          localStorage.setItem(TIMESTAMP_KEY, now.toString())
          setQuestionCount(0)
          setHasReachedLimit(false)
          setTimeUntilReset(RESET_HOURS * 60 * 60 * 1000)
        } else {
          const msUntilReset = (RESET_HOURS * 60 * 60 * 1000) - (now - timestamp)
          setTimeUntilReset(msUntilReset)
        }
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const incrementCount = () => {
    const newCount = questionCount + 1
    setQuestionCount(newCount)
    localStorage.setItem(STORAGE_KEY, newCount.toString())
    
    if (newCount >= FREE_QUESTION_LIMIT) {
      setHasReachedLimit(true)
    }

    return newCount
  }

  const resetCount = () => {
    const now = Date.now()
    setQuestionCount(0)
    localStorage.setItem(STORAGE_KEY, '0')
    localStorage.setItem(TIMESTAMP_KEY, now.toString())
    setHasReachedLimit(false)
    setTimeUntilReset(RESET_HOURS * 60 * 60 * 1000)
  }

  const remainingQuestions = Math.max(0, FREE_QUESTION_LIMIT - questionCount)

  // Format time until reset (e.g., "23h 45m")
  const getResetTimeString = () => {
    if (!timeUntilReset) return ''
    
    const hours = Math.floor(timeUntilReset / (1000 * 60 * 60))
    const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return {
    questionCount,
    hasReachedLimit,
    remainingQuestions,
    incrementCount,
    resetCount,
    timeUntilReset,
    resetTimeString: getResetTimeString(),
  }
}
