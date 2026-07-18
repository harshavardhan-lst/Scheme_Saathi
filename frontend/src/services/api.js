import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ss_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Normalize error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error?.message || error.message || 'An error occurred'
    const code = error.response?.data?.error?.code || 'UNKNOWN_ERROR'
    const enriched = new Error(message)
    enriched.code = code
    enriched.status = error.response?.status
    enriched.data = error.response?.data
    return Promise.reject(enriched)
  }
)

export default api
