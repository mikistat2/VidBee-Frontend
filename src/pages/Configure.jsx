import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { usePlatform } from '../hooks/usePlatform'
import api from '../lib/api'

const DIFFICULTIES = [
  { value: 'easy', emoji: '🌱', label: 'Easy', sub: 'Core concepts' },
  { value: 'medium', emoji: '⚡', label: 'Medium', sub: 'Apply knowledge' },
  { value: 'hard', emoji: '🔥', label: 'Hard', sub: 'Deep analysis' },
]

const ANSWER_MODES = [
  { value: 'immediate', label: 'Show answer immediately', desc: 'See if you\'re right after each question' },
  { value: 'end', label: 'Reveal answers at the end', desc: 'Go through all questions first, then review' },
]

export default function ConfigurePage() {
  const { uploadId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isMobile } = usePlatform()
  
  const searchParams = new URLSearchParams(location.search)
  const initialCount = parseInt(searchParams.get('count')) || 10
  const initialDiff = searchParams.get('difficulty') || 'medium'
  const initialMode = searchParams.get('mode') || 'immediate'

  const [upload, setUpload] = useState(null)
  const [config, setConfig] = useState({ questionCount: initialCount, difficulty: initialDiff, answerMode: initialMode })
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/upload/${uploadId}`).then(r => setUpload(r.data.upload)).catch(() => navigate('/'))
  }, [uploadId])

  const set = (key, val) => setConfig(c => ({ ...c, [key]: val }))

  const generate = async () => {
    setGenerating(true)
    setError('')
    try {
      const res = await api.post('/quiz/generate', { uploadId, ...config })
      navigate(`/quiz/${res.data.sessionId}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed.')
      setGenerating(false)
    }
  }

  const estimatedMins = Math.max(1, Math.round(config.questionCount * 0.3))

  const controls = (
    <ConfigControls config={config} set={set} isMobile={isMobile} />
  )

  if (!upload) return <div className="flex items-center justify-center h-full text-gray-400 text-sm">Loading…</div>

  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="px-4 pt-4 pb-2 border-b border-gray-100 flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="text-gray-400">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 4L6 8l4 4" /></svg>
          </button>
          <span className="text-[14px] font-medium">Configure quiz</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {controls}
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={generate}
            disabled={generating}
            className="w-full py-3 bg-[#1a1a1a] text-white rounded-xl text-[14px] font-medium disabled:opacity-50"
          >
            {generating ? 'Generating quiz…' : `Generate ${config.questionCount} questions →`}
          </button>
          <p className="text-center text-[11px] text-gray-400 mt-1.5">~{estimatedMins} min estimated</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#f9f9f7]">
      <div className="bg-white border-b border-black/[0.08] px-7 h-[56px] flex items-center gap-3 flex-shrink-0">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[14px] text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-50">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 4L6 8l4 4" /></svg>
          Back
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-[16px] font-medium">Configure quiz</span>
      </div>

      <div className="flex-1 overflow-y-auto p-7 flex gap-6 items-start scrollbar-thin">
        <div className="flex-1 min-w-0 space-y-3.5">
          {/* Doc pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-100 rounded-xl text-sm">
            <span className="text-[11px] font-medium px-2 py-0.5 bg-orange-50 text-orange-800 border border-orange-300 rounded-full uppercase">{upload.file_type}</span>
            <span className="font-medium">{upload.original_name}</span>
            <span className="text-gray-400">{upload.page_count} pages</span>
          </div>

          {controls}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Summary sidebar */}
        <div className="w-[240px] flex-shrink-0">
          <div className="bg-white border border-gray-100 rounded-xl p-5 sticky top-0">
            <p className="text-[14px] font-medium mb-4">Quiz summary</p>
            <div className="space-y-2.5 mb-5">
              {[
                ['Questions', config.questionCount],
                ['Difficulty', DIFFICULTIES.find(d => d.value === config.difficulty)?.label],
                ['Answer mode', config.answerMode === 'immediate' ? 'Immediate' : 'At the end'],
                ['Document', upload.original_name.replace(/\.[^.]+$/, '')],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-[13px] text-gray-400">{k}</span>
                  <span className="text-[13px] font-medium truncate max-w-[120px]">{v}</span>
                </div>
              ))}
            </div>
            <button
              onClick={generate}
              disabled={generating}
              className="w-full py-2.5 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {generating ? 'Generating…' : 'Generate quiz →'}
            </button>
            <p className="text-center text-[12px] text-gray-400 mt-2">~{estimatedMins} min estimated</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConfigControls({ config, set, isMobile }) {
  const cardClass = `bg-${isMobile ? 'gray-50' : 'white'} border border-gray-100 rounded-xl p-4`

  return (
    <>
      {/* Question count */}
      <div className={cardClass}>
        <div className="flex justify-between items-baseline mb-4">
          <p className="text-[14px] font-medium">Number of questions</p>
          <p className="text-[14px] font-medium">{config.questionCount}</p>
        </div>
        <input
          type="range" min="5" max="30" step="5"
          value={config.questionCount}
          onChange={(e) => set('questionCount', Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between mt-1.5">
          {[5, 10, 15, 20, 25, 30].map(n => (
            <span key={n} className="text-[11px] text-gray-400">{n}</span>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className={cardClass}>
        <p className="text-[14px] font-medium mb-3">Difficulty</p>
        <div className="grid grid-cols-3 gap-2">
          {DIFFICULTIES.map(d => (
            <button
              key={d.value}
              onClick={() => set('difficulty', d.value)}
              className={`rounded-lg border p-3 text-center transition-all ${config.difficulty === d.value
                  ? 'border-gray-900 bg-gray-100'
                  : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
            >
              <span className="text-xl block mb-1">{d.emoji}</span>
              <span className={`text-[13px] font-medium block ${config.difficulty === d.value ? 'text-gray-900' : 'text-gray-500'}`}>{d.label}</span>
              <span className="text-[11px] text-gray-400">{d.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Answer mode */}
      <div className={cardClass}>
        <p className="text-[14px] font-medium mb-3">Answer mode</p>
        <div className="space-y-2">
          {ANSWER_MODES.map(m => (
            <button
              key={m.value}
              onClick={() => set('answerMode', m.value)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${config.answerMode === m.value ? 'border-gray-900 bg-gray-50' : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
            >
              <div>
                <p className="text-[13px] font-medium">{m.label}</p>
                <p className="text-[12px] text-gray-400 mt-0.5">{m.desc}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ml-3 ${config.answerMode === m.value ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                }`}>
                {config.answerMode === m.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
