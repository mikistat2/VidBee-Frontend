import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OAuthGoogleCallbackPage() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Finishing Google sign-in…')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const error = params.get('error')

    if (error) {
      setMessage('Google sign-in failed. Redirecting…')
      setTimeout(() => navigate('/auth', { replace: true }), 800)
      return
    }

    if (!token) {
      setMessage('Missing sign-in token. Redirecting…')
      setTimeout(() => navigate('/auth', { replace: true }), 800)
      return
    }

    localStorage.setItem('vidbee_token', token)
    // Full reload so AuthProvider picks up token + /auth/me
    window.location.replace('/home')
  }, [navigate])

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </div>
  )
}
