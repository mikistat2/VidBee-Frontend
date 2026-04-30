import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/UseAuth'
import { usePlatform } from '../hooks/usePlatform'
import { GoogleIcon } from '../components/Icons'
import { wakeUpServer } from '../lib/api'
import { Capacitor } from '@capacitor/core'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'

function Field({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase ml-0.5">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full px-4 py-3 text-sm border border-zinc-800 rounded-xl bg-zinc-900 text-white outline-none focus:border-zinc-600 focus:ring-2 focus:ring-white/5 placeholder:text-zinc-600 transition-all duration-200"
      />
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-zinc-800" />
      <span className="text-xs text-zinc-600 font-bold tracking-widest uppercase">or</span>
      <div className="flex-1 h-px bg-zinc-800" />
    </div>
  )
}

function GoogleBtn({ onGoogle }) {
  return (
    <button
      type="button"
      onClick={onGoogle}
      className="w-full py-3 flex items-center justify-center gap-2.5 border border-zinc-800 rounded-xl text-sm font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-700 active:scale-[0.98] transition-all duration-200"
    >
      <GoogleIcon className="w-4 h-4" />
      Continue with Google
    </button>
  )
}

function LoginPanel({ form, set, loading, onSubmit, onGoogle }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Field label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center ml-0.5">
          <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">Password</label>
          <span className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors duration-150">
            Forgot password?
          </span>
        </div>
        <input
          type="password"
          value={form.password}
          onChange={set('password')}
          placeholder="••••••••"
          required
          className="w-full px-4 py-3 text-sm border border-zinc-800 rounded-xl bg-zinc-900 text-white outline-none focus:border-zinc-600 focus:ring-2 focus:ring-white/5 placeholder:text-zinc-600 transition-all duration-200"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-white text-zinc-950 rounded-xl text-sm font-bold cursor-pointer hover:bg-zinc-100 active:scale-[0.98] transition-all duration-200 mt-1 disabled:opacity-40 shadow-lg shadow-black/30"
      >
        {loading ? 'Please wait…' : 'Log in to VidBee'}
      </button>
      <Divider />
      <GoogleBtn onGoogle={onGoogle} />
    </form>
  )
}

function SignupPanel({ form, set, loading, onSubmit, onGoogle, isMobile }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className={isMobile ? 'flex flex-col gap-3' : 'flex gap-3'}>
        <Field label="First name" value={form.firstName} onChange={set('firstName')} placeholder="Jamie" />
        <Field label="Last name" value={form.lastName} onChange={set('lastName')} placeholder="Doe" />
      </div>
      <Field label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
      <Field label="Password" type="password" value={form.password} onChange={set('password')} placeholder="At least 8 characters" />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-white text-zinc-950 rounded-xl text-sm font-bold cursor-pointer hover:bg-zinc-100 active:scale-[0.98] transition-all duration-200 mt-1 disabled:opacity-40 shadow-lg shadow-black/30"
      >
        {loading ? 'Please wait…' : 'Create account'}
      </button>
      <Divider />
      <GoogleBtn onGoogle={onGoogle} />
      <p className="text-xs text-zinc-600 text-center leading-relaxed px-2">
        By signing up you agree to our{' '}
        <span className="text-zinc-400 cursor-pointer hover:text-white transition-colors duration-150">Terms of Service</span>{' '}
        and{' '}
        <span className="text-zinc-400 cursor-pointer hover:text-white transition-colors duration-150">Privacy Policy</span>.
      </p>
    </form>
  )
}

const FEATURES = [
  { emoji: '📄', text: 'PDF, PowerPoint & Word support' },
  { emoji: '⚙️', text: 'Choose difficulty, question count & answer mode' },
  { emoji: '🧠', text: 'AI explanations for every question' },
  { emoji: '📈', text: 'Track your progress over time' },
]

export default function AuthPage() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, register, googleLogin } = useAuth()
  const navigate = useNavigate()
  const { isMobile } = usePlatform()

  // Initialize Google Auth for native platform
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      GoogleAuth.initialize({
        clientId: '1070191817655-usiku083ejksbgqoal339k0j0dikfgs6.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      })
    }
  }, [])

  // Ping the server as soon as the auth page loads so it wakes up
  // before the user finishes filling in the form (Render free-tier cold start).
  useEffect(() => { wakeUpServer() }, [])

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      if (Capacitor.isNativePlatform()) {
        const googleUser = await GoogleAuth.signIn()
        if (googleUser && googleUser.authentication && googleUser.authentication.idToken) {
          await googleLogin(googleUser.authentication.idToken)
          navigate('/home')
        } else {
          setError('Google login failed: missing idToken.')
        }
      } else {
        // Derive server origin from VITE_API_URL (default: http://localhost:5000/api)
        const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? `${window.location.origin}/api` : 'http://localhost:5000/api')
        const serverOrigin = apiUrl.replace(/\/api\/?$/, '')
        window.location.href = `${serverOrigin}/auth/google`
      }
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.error || 'Google login failed or was cancelled.')
    } finally {
      setLoading(false)
    }
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form.firstName, form.lastName, form.email, form.password)
      }
      navigate('/home')
    } catch (err) {
      if (!err?.response) {
        setError('Server is waking up — please wait a few seconds and try again.')
      } else {
        setError(err?.response?.data?.error || 'Something went wrong.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`flex bg-zinc-950 ${isMobile ? 'min-h-screen overflow-y-auto' : 'h-screen overflow-hidden'}`}>
      {/* Left branding panel — desktop only */}
      {!isMobile && (
        <div className="hidden lg:flex w-[46%] shrink-0 flex-col justify-between p-14 border-r border-zinc-900 bg-zinc-950 relative overflow-hidden">
          {/* Subtle ambient glow */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-400/3 rounded-full blur-3xl pointer-events-none" />

          {/* Logo */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl shadow-xl">
              🐝
            </div>
            <span className="text-lg font-extrabold text-white tracking-tight">VidBee</span>
          </div>

          {/* Hero copy */}
          <div className="max-w-sm relative z-10">
            <h1 className="text-5xl font-black text-white leading-tight tracking-tight mb-5">
              Study smarter,<br />
              not{' '}
              <span className="relative inline-block">
                harder.
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-400 rounded-full" />
              </span>
            </h1>
            <p className="text-base text-zinc-400 leading-relaxed mb-10 font-medium">
              Upload any document and let AI craft the perfect quiz to lock in what you've learned.
            </p>
            <ul className="flex flex-col gap-4">
              {FEATURES.map((f) => (
                <li key={f.text} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm shrink-0 group-hover:border-zinc-700 transition-colors duration-150">
                    {f.emoji}
                  </div>
                  <span className="text-sm text-zinc-400 font-medium group-hover:text-zinc-300 transition-colors duration-150">
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-zinc-600 font-bold tracking-widest uppercase relative z-10">
            © 2025 VidBee
          </p>
        </div>
      )}

      {/* Right form panel */}
      <div className={`flex-1 flex flex-col items-center bg-zinc-950 relative overflow-hidden ${isMobile ? 'justify-start px-6 py-10' : 'justify-center p-6'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.03),transparent_70%)] pointer-events-none" />

        <div className={`w-full max-w-sm relative z-10 ${isMobile ? 'pb-10' : ''}`}>
          {/* Mobile header */}
          {isMobile && (
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl mb-5 shadow-xl">
                🐝
              </div>
              <h1 className="text-3xl font-black text-white leading-tight mb-2">
                Study smarter,<br />not{' '}
                <span className="text-yellow-400">harder.</span>
              </h1>
              <p className="text-sm text-zinc-400 font-medium">
                Upload docs, get AI-powered quizzes instantly.
              </p>
            </div>
          )}

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">
              {tab === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              {tab === 'login'
                ? 'Log in to continue your learning streak.'
                : 'Start quizzing smarter today.'}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex p-1 bg-zinc-900 rounded-xl mb-8 border border-zinc-800">
            {['login', 'signup'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer
                  ${tab === t
                    ? 'bg-zinc-800 text-white shadow-sm shadow-black/40'
                    : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                {t === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-xs text-red-400 text-center font-semibold">{error}</p>
            </div>
          )}

          {/* Form */}
          {tab === 'login'
            ? <LoginPanel form={form} set={set} loading={loading} onSubmit={handleSubmit} onGoogle={handleGoogle} />
            : <SignupPanel form={form} set={set} loading={loading} onSubmit={handleSubmit} onGoogle={handleGoogle} isMobile={isMobile} />
          }

          {/* Skip link */}
          <p className="text-center mt-8">
            <span
              className="text-xs text-zinc-600 font-bold uppercase tracking-widest cursor-pointer hover:text-zinc-400 transition-colors duration-150"
              onClick={() => navigate('/home')}
            >
              Skip to app →
            </span>
          </p>
        </div>
      </div>
    </div>
  )
};
