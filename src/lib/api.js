import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  // Render free tier can take up to ~60s to cold-start.
  // Use 70s so the first request survives the wake-up.
  timeout: 70000,
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

// Handle 401 globally + auto-retry once on network failure (Render cold start)
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const config = err.config

    // Retry once on network errors (no response = server was cold-starting)
    if (!err.response && !config._retried) {
      config._retried = true
      // Small delay before retry so the server has a moment to finish booting
      await new Promise((r) => setTimeout(r, 3000))
      return api(config)
    }

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

/**
 * Call this early (e.g. on Auth page mount) to wake the Render server
 * before the user hits submit, so the cold-start delay is invisible.
 */
export function wakeUpServer() {
  api.get('/health').catch(() => {
    // Ignore errors — this is just a warm-up ping
  })
}

export default api
