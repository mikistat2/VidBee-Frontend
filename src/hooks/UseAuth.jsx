import { useState, useEffect, createContext, useContext } from 'react'
import api from '../lib/api'

// ─── Mock mode toggle ───────────────────────────────────────────────────────
// Set to true to use mock data (no backend needed), false for real backend.
const USE_MOCK_MODE = false

if (USE_MOCK_MODE) {
  import('../lib/mockData').then(({ installMockInterceptors }) => {
    installMockInterceptors(api)
  })
}

// ─── Auth Context ───────────────────────────────────────────────────────────
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('vidbee_token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('vidbee_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { token, user } = res.data
    localStorage.setItem('vidbee_token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
    return user
  }

  const register = async (firstName, lastName, email, password) => {
    const res = await api.post('/auth/register', { firstName, lastName, email, password })
    const { token, user } = res.data
    localStorage.setItem('vidbee_token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('vidbee_token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
