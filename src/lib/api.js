import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  // NOTE: Don't set Content-Type here — axios auto-detects it.
  // Setting 'application/json' as default breaks FormData uploads (multipart/form-data).
})

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vidbee_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('vidbee_token')
      // Don't redirect if already on auth page
      if (window.location.pathname !== '/') {
        window.location.href = '/'
      }
    }
    return Promise.reject(err)
  }
)

export default api
