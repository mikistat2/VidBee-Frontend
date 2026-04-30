import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlatform } from '../hooks/usePlatform'
import api from '../lib/api'

export default function HistoryPage() {
  const navigate = useNavigate()
  const { isMobile } = usePlatform()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/quiz/history').then(r => setSessions(r.data.sessions || [])).finally(() => setLoading(false))
  }, [])

  const TYPE_STYLES = {
    pdf: 'bg-orange-50 text-orange-800 border-orange-300',
    pptx: 'bg-amber-50 text-amber-800 border-amber-300',
    docx: 'bg-blue-50 text-blue-800 border-blue-300',
  }

  const scoreColor = (score) =>
    score >= 80 ? 'text-green-700' : score >= 50 ? 'text-amber-700' : 'text-red-600'

  const Card = ({ s }) => (
    <div className={`bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors ${isMobile ? '' : ''}`}>
      <div className="flex items-start justify-between mb-2">
        <span className={`text-[12px] font-medium px-2 py-0.5 rounded-full border ${TYPE_STYLES[s.file_type] || TYPE_STYLES.pdf}`}>
          {(s.file_type || 'pdf').toUpperCase()}
        </span>
        <span className={`text-[15px] font-medium ${scoreColor(s.score)}`}>{s.score}%</span>
      </div>
      <p className={`font-medium truncate mb-1 ${isMobile ? 'text-[14px]' : 'text-[16px]'}`}>{s.upload_name}</p>
      <p className="text-[14px] text-gray-400 mb-4">
        {s.question_count} questions · {s.difficulty} · {new Date(s.created_at).toLocaleDateString()}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/results/${s.id}`)}
          className="flex-1 py-1.5 border border-gray-200 text-[13px] rounded-lg hover:bg-gray-50 text-gray-600"
        >
          View results
        </button>
        <button
          onClick={() => navigate(`/configure/${s.upload_id}?difficulty=${s.difficulty}&count=${s.question_count}&mode=${s.answer_mode || 'immediate'}`)}
          className="flex-1 py-1.5 bg-[#1a1a1a] text-white text-[13px] font-medium rounded-lg"
        >
          Retake
        </button>
      </div>
    </div>
  )

  const content = (
    <div className={`${isMobile ? 'p-4' : 'p-7'} flex-1 overflow-y-auto scrollbar-thin`}>
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
        </div>
      )}
      {!loading && sessions.length === 0 && (
        <div className="text-center py-20">
          <p className="text-3xl mb-3">📋</p>
          <p className="text-[15px] font-medium text-gray-700 mb-1">No quizzes yet</p>
          <p className="text-[14px] text-gray-400 mb-4">Upload a document and generate your first quiz.</p>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-[#1a1a1a] text-white text-[14px] font-medium rounded-lg">
            Upload a document
          </button>
        </div>
      )}
      {!loading && sessions.length > 0 && (
        <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {sessions.map(s => <Card key={s.id} s={s} />)}
        </div>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="px-4 pt-4 pb-2 border-b border-gray-100 flex-shrink-0">
          <span className="text-[15px] font-medium">History</span>
        </div>
        {content}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-white border-b border-black/[0.08] px-7 h-[56px] flex items-center justify-between flex-shrink-0">
        <span className="text-[16px] font-medium">Quiz history</span>
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-[#1a1a1a] text-white text-[15px] font-medium rounded-lg">
          + New quiz
        </button>
      </div>
      {content}
    </div>
  )
}
