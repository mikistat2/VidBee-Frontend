import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlatform } from '../hooks/usePlatform'
import { useAuth } from '../hooks/UseAuth'
import api from '../lib/api'

const TYPE_STYLES = {
  pdf: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-300' },
  pptx: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
  docx: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300' },
}

function TypeBadge({ type, size = 'sm' }) {
  const s = TYPE_STYLES[type] || TYPE_STYLES.pdf
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[12px]' : 'px-2.5 py-0.5 text-[13px]'
  return (
    <span className={`${s.bg} ${s.text} border ${s.border} rounded-full font-medium ${padding}`}>
      {type.toUpperCase()}
    </span>
  )
}

export default function HomePage() {
  const { isMobile } = usePlatform()
  const { user } = useAuth()
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploads, setUploads] = useState([])
  const [error, setError] = useState('')
  const fileRef = useRef()
  const navigate = useNavigate()

  const handleFile = async (file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['pdf', 'pptx', 'docx'].includes(ext)) {
      setError('Only PDF, PPTX, and DOCX files are supported.')
      return
    }
    setError('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await api.post('/upload', fd)
      navigate(`/configure/${res.data.uploadId}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  // Load recent uploads on mount
  useEffect(() => {
    api.get('/upload/recent').then(r => setUploads(r.data.uploads || [])).catch(() => { })
  }, [])

  return isMobile
    ? <MobileHome uploads={uploads} uploading={uploading} error={error} fileRef={fileRef} handleFile={handleFile} navigate={navigate} user={user} />
    : <WebHome uploads={uploads} uploading={uploading} error={error} dragging={dragging} setDragging={setDragging} onDrop={onDrop} fileRef={fileRef} handleFile={handleFile} navigate={navigate} />
}

/* ─── Web ─── */
function WebHome({ uploads, uploading, error, dragging, setDragging, onDrop, fileRef, handleFile, navigate }) {
  return (
    <div className="flex flex-col h-full bg-[#f9f9f7]">
      {/* Topbar */}
      <div className="bg-white border-b border-black/[0.08] px-7 h-[56px] flex items-center justify-between flex-shrink-0">
        <span className="text-[16px] font-medium">Upload a document</span>
        <button className="px-4 py-2 bg-[#1a1a1a] text-white text-[15px] font-medium rounded-lg">
          + New quiz
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
        <h1 className="text-[28px] font-medium tracking-tight mb-1.5">Turn any document into a quiz</h1>
        <p className="text-[17px] text-gray-500 mb-8">Upload a PDF, PowerPoint, or Word file and VidBee will generate smart questions from it.</p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current.click()}
          className={`border-[1.5px] border-dashed rounded-xl p-12 flex flex-col items-center text-center cursor-pointer transition-all mb-7 ${dragging ? 'border-purple-400 bg-purple-50' : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
            }`}
        >
          <input ref={fileRef} type="file" accept=".pdf,.pptx,.docx" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          <div className="w-13 h-13 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-4">
            {uploading
              ? <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
              : <UploadIcon />
            }
          </div>
          <p className="text-[17px] font-medium mb-1">{uploading ? 'Uploading…' : 'Drop your file here, or click to browse'}</p>
          <p className="text-[15px] text-gray-400 mb-5">Maximum file size 25 MB</p>
          <div className="flex gap-1.5">
            <TypeBadge type="pdf" /><TypeBadge type="pptx" /><TypeBadge type="docx" />
          </div>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>

        {/* Recent */}
        <p className="text-[14px] font-medium mb-3">Recent documents</p>
        {uploads.length === 0
          ? <p className="text-[15px] text-gray-400">No documents uploaded yet.</p>
          : (
            <div className="grid grid-cols-3 gap-3">
              {uploads.map(u => (
                <DocCard key={u.id} upload={u} onQuiz={() => navigate(`/configure/${u.id}`)} />
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}

/* ─── Mobile ─── */
function MobileHome({ uploads, uploading, error, fileRef, handleFile, navigate, user }) {
  const initials = user
    ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
    : 'U'

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between border-b border-gray-100">
        <span className="text-[16px] font-medium">Upload</span>
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[11px] font-medium"
          aria-label="Open profile"
        >
          {initials}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div
          onClick={() => fileRef.current.click()}
          className="border-[1.5px] border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center text-center cursor-pointer active:bg-gray-50"
        >
          <input ref={fileRef} type="file" accept=".pdf,.pptx,.docx" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
            {uploading ? <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin" /> : <UploadIcon size={18} />}
          </div>
          <p className="text-[14px] font-medium mb-1">{uploading ? 'Uploading…' : 'Tap to upload a file'}</p>
          <p className="text-[12px] text-gray-400 mb-3">PDF, PPTX or DOCX · Max 25 MB</p>
          <div className="flex gap-1">
            <TypeBadge type="pdf" /><TypeBadge type="pptx" /><TypeBadge type="docx" />
          </div>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        <p className="text-[13px] font-medium">Recent</p>
        {uploads.length === 0
          ? <p className="text-[13px] text-gray-400">No documents yet.</p>
          : uploads.map(u => (
            <div key={u.id} className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TypeBadge type={u.file_type} />
                <div>
                  <p className="text-[13px] font-medium truncate max-w-[150px]">{u.original_name}</p>
                  <p className="text-[11px] text-gray-400">{u.page_count} pages</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/configure/${u.id}`)}
                className="px-2.5 py-1 bg-[#1a1a1a] text-white text-[12px] font-medium rounded-md"
              >
                Quiz
              </button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

function DocCard({ upload, onQuiz }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
      <div className="flex items-start justify-between mb-2.5">
        <TypeBadge type={upload.file_type} />
        <span className="text-gray-300 text-base leading-none cursor-pointer">···</span>
      </div>
      <p className="text-[14px] font-medium truncate mb-0.5">{upload.original_name}</p>
      <p className="text-[13px] text-gray-400 mb-3">{upload.page_count} pages</p>
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-gray-400">{upload.quiz_count || 0} quizzes</span>
        <button onClick={onQuiz} className="px-2.5 py-1 bg-[#1a1a1a] text-white text-[13px] font-medium rounded-md">
          Quiz again
        </button>
      </div>
    </div>
  )
}

function UploadIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}
