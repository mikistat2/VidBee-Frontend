import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/UseAuth'

const navItems = [
  {
    to: '/home', label: 'Upload', icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="12" height="12" rx="2" /><path d="M5 8h6M5 5h6M5 11h4" />
      </svg>
    )
  },
  {
    to: '/history', label: 'History', icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="5" /><path d="M8 5v3l2 2" />
      </svg>
    )
  },
]

export default function WebLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const initials = user
    ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
    : 'U'

  return (
    <div className="flex h-screen bg-[#f9f9f7]">
      {/* Sidebar */}
      <aside className="w-[220px] flex-shrink-0 bg-white border-r border-black/[0.08] flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-black/[0.08] flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-base">🐝</div>
          <span className="text-[17px] font-medium tracking-tight">VidBee</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3">
          <p className="text-[12px] text-gray-400 uppercase tracking-[0.8px] px-2.5 mb-2">Menu</p>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/home'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[15px] mb-1 transition-colors ${isActive
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-500 hover:bg-gray-50'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-2.5 border-t border-black/[0.08]">
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[11px] font-medium"
              aria-label="Open profile"
            >
              {initials}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex-1 min-w-0 text-left"
            >
              <p className="text-[14px] font-medium truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-[12px] text-gray-400">Free plan</p>
            </button>
            <button onClick={logout} className="text-[12px] text-gray-400 hover:text-gray-600">Out</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
