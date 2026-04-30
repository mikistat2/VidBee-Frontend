import { NavLink } from 'react-router-dom'

const tabs = [
  {
    to: '/home', label: 'Upload', icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="12" height="12" rx="2" /><path d="M5 8h6M5 5h6M5 11h4" />
      </svg>
    )
  },
  {
    to: '/history', label: 'History', icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="5" /><path d="M8 5v3l2 2" />
      </svg>
    )
  },
  {
    to: '/profile', label: 'Profile', icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="6" r="2.5" /><path d="M3 13c0-2.76 2.24-5 5-5s5 2.24 5 5" />
      </svg>
    )
  },
]

export default function MobileLayout({ children }) {
  return (
    <div className="flex flex-col h-screen bg-[#f9f9f7] mobile-no-scrollbar">
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Bottom Tab Bar */}
      <nav className="flex bg-white border-t border-black/[0.08] safe-area-pb">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/home'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 gap-0.5 ${isActive ? 'text-gray-900' : 'text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {tab.icon}
                <span className="text-[10px]">{tab.label}</span>
                {isActive && <div className="w-4 h-0.5 rounded-full bg-gray-900 mt-0.5" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
