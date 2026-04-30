import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/UseAuth'
import { usePlatform } from '../hooks/usePlatform'

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
      <p className="text-[12px] uppercase tracking-wide text-gray-400 mb-1.5">{label}</p>
      <p className="text-[15px] text-gray-900 font-medium break-all">{value || 'Not set'}</p>
    </div>
  )
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { isMobile } = usePlatform()
  const navigate = useNavigate()

  const initials = user
    ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
    : 'U'

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim() || 'Your profile'

  const content = (
    <div className={`${isMobile ? 'p-4' : 'p-7'} flex-1 overflow-y-auto scrollbar-thin`}>
      <div className="max-w-2xl">
        <div className="rounded-2xl border border-black/8 bg-white p-5 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-lg font-semibold">
              {initials}
            </div>
            <div>
              <p className="text-[18px] font-semibold text-gray-900">{fullName}</p>
              <p className="text-[13px] text-gray-500">{user?.email || 'No email available'}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <InfoItem label="First name" value={user?.first_name} />
          <InfoItem label="Last name" value={user?.last_name} />
          <InfoItem label="Email" value={user?.email} />
        </div>

        <button
          type="button"
          onClick={() => {
            logout()
            navigate('/', { replace: true })
          }}
          className="mt-5 px-4 py-2 bg-[#1a1a1a] text-white text-[13px] font-medium rounded-lg"
        >
          Log out
        </button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="px-4 pt-4 pb-2 border-b border-gray-100 shrink-0">
          <span className="text-[14px] font-medium">Profile</span>
        </div>
        {content}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#f9f9f7]">
      <div className="bg-white border-b border-black/8 px-7 h-[56px] flex items-center justify-between shrink-0">
        <span className="text-[16px] font-medium">Profile</span>
      </div>
      {content}
    </div>
  )
}
