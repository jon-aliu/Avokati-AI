import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface Source {
  law_id: string
  title: string
  url: string
  chunk_text: string
  score?: number
}

export interface AskResponse {
  answer: string
  sources: Source[]
  confidence: number
  query_time_ms: number
}

export interface HealthResponse {
  status: string
  db_ready: boolean
  timestamp: string
}

/**
 * Check backend health status
 */
export async function checkHealth(): Promise<HealthResponse> {
  const response = await axios.get<HealthResponse>(`${API_URL}/health`, {
    timeout: 5000,
  })
  return response.data
}

/**
 * Ask a question to the legal AI
 */
export async function askQuestion(
  question: string,
  topK: number = 3
): Promise<AskResponse> {
  const response = await axios.post<AskResponse>(`${API_URL}/ask`, {
    question,
    top_k: topK,
  })
  return response.data
}

/**
 * API client instance
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.message)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)
