import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePlatform } from '../hooks/usePlatform'
import api from '../lib/api'

export default function ResultsPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { isMobile } = usePlatform()
  const [results, setResults] = useState(null)

  useEffect(() => {
    api.get(`/quiz/results/${sessionId}`).then(r => setResults(r.data)).catch(() => navigate('/'))
  }, [sessionId])

  if (!results) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
    </div>
  )

  const { session, questions, answers } = results
  const total = questions.length
  const correct = answers.filter(a => a.is_correct).length
  const wrong = total - correct
  const score = Math.round((correct / total) * 100)

  const grade =
    score >= 90 ? { label: 'Excellent', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' }
      : score >= 70 ? { label: 'Good job', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' }
        : score >= 50 ? { label: 'Keep going', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' }
          : { label: 'Needs work', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' }

  const wrongQuestions = questions.filter(q => {
    const a = answers.find(a => a.question_id === q.id)
    return a && !a.is_correct
  })

  const props = { session, questions, answers, total, correct, wrong, score, grade, wrongQuestions, navigate, sessionId }
  return isMobile ? <MobileResults {...props} /> : <WebResults {...props} />
}

function WebResults({ session, questions, answers, total, correct, wrong, score, grade, wrongQuestions, navigate, sessionId }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-white border-b border-black/8 px-7 h-[56px] flex items-center justify-between shrink-0">
        <span className="text-[17px] font-medium">Quiz results</span>
        <div className="flex gap-2">
          <button onClick={() => navigate('/')} className="px-4 py-2 border border-gray-200 text-[15px] rounded-lg hover:bg-gray-50">
            Upload new
          </button>
          <button onClick={() => navigate(`/configure/${session.upload_id}?difficulty=${session.difficulty}&count=${session.question_count}`)} className="px-4 py-2 bg-[#1a1a1a] text-white text-[15px] font-medium rounded-lg">
            Retake quiz
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-7 scrollbar-thin">
        {/* Score card */}
        <div className={`${grade.bg} border ${grade.border} rounded-2xl p-7 mb-7 flex items-center gap-8`}>
          <div className="text-center">
            <p className="text-6xl font-medium text-gray-900 mb-1">{score}<span className="text-2xl text-gray-400">%</span></p>
            <p className={`text-[16px] font-medium ${grade.color}`}>{grade.label}</p>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-4">
            {[
              { label: 'Correct', val: correct, color: 'text-green-700' },
              { label: 'Wrong', val: wrong, color: 'text-red-600' },
              { label: 'Total', val: total, color: 'text-gray-700' },
            ].map(s => (
              <div key={s.label} className="bg-white/70 rounded-xl p-4 text-center border border-white">
                <p className={`text-3xl font-medium ${s.color} mb-0.5`}>{s.val}</p>
                <p className="text-[14px] text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wrong answers review */}
        {wrongQuestions.length > 0 && (
          <>
            <p className="text-[15px] font-medium mb-3">Review wrong answers ({wrongQuestions.length})</p>
            <div className="space-y-3">
              {wrongQuestions.map((q, i) => {
                const a = answers.find(a => a.question_id === q.id)
                const exp = normalizeExplanation(q)
                return (
                  <div key={q.id} className="bg-white border border-gray-100 rounded-xl p-5">
                    <p className="text-[13px] text-gray-400 mb-1">Question {questions.indexOf(q) + 1}</p>
                    <p className="text-[15px] font-medium text-gray-900 mb-3">{q.question}</p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        <p className="text-[12px] text-red-500 mb-0.5">Your answer</p>
                        <p className="text-[14px] text-red-800 font-medium">{a?.selected_answer || 'Skipped'}</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        <p className="text-[12px] text-green-600 mb-0.5">Correct answer</p>
                        <p className="text-[14px] text-green-800 font-medium">{q.correct_answer}</p>
                      </div>
                    </div>

                    {exp ? (
                      <div className="text-[17px] text-gray-600 leading-relaxed space-y-2">
                        {exp.correct && <p>{exp.correct}</p>}
                      </div>
                    ) : (
                      <p className="text-[17px] text-gray-500 leading-relaxed">No explanation available for this question.</p>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {wrongQuestions.length === 0 && (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-[16px] font-medium text-gray-900 mb-1">Perfect score!</p>
            <p className="text-[14px] text-gray-400">You got every question right.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function MobileResults({ session, questions, answers, total, correct, wrong, score, grade, wrongQuestions, navigate }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 pt-4 pb-2 border-b border-gray-100 shrink-0">
        <span className="text-[15px] font-medium">Results</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Score */}
        <div className={`${grade.bg} border ${grade.border} rounded-2xl p-5 text-center`}>
          <p className="text-4xl font-medium text-gray-900 mb-1">{score}<span className="text-xl text-gray-400">%</span></p>
          <p className={`text-[14px] font-medium ${grade.color} mb-4`}>{grade.label}</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Correct', val: correct, color: 'text-green-700' },
              { label: 'Wrong', val: wrong, color: 'text-red-600' },
              { label: 'Total', val: total, color: 'text-gray-700' },
            ].map(s => (
              <div key={s.label} className="bg-white/70 rounded-lg p-2 border border-white">
                <p className={`text-xl font-medium ${s.color}`}>{s.val}</p>
                <p className="text-[11px] text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {wrongQuestions.length > 0 && (
          <>
            <p className="text-[13px] font-medium">Wrong answers ({wrongQuestions.length})</p>
            {wrongQuestions.map(q => {
              const a = answers.find(a => a.question_id === q.id)
              const exp = normalizeExplanation(q)
              return (
                <div key={q.id} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-[13px] font-medium text-gray-900 mb-2">{q.question}</p>
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    <div className="bg-red-50 border border-red-200 rounded-lg px-2 py-1.5">
                      <p className="text-[11px] text-red-500 mb-0.5">Your answer</p>
                      <p className="text-[12px] text-red-800 font-medium">{a?.selected_answer || 'Skipped'}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg px-2 py-1.5">
                      <p className="text-[11px] text-green-600 mb-0.5">Correct answer</p>
                      <p className="text-[12px] text-green-800 font-medium">{q.correct_answer}</p>
                    </div>
                  </div>

                  {exp ? (
                    <div className="text-[12px] text-gray-600 leading-relaxed space-y-2">
                      {exp.correct && <p>{exp.correct}</p>}
                    </div>
                  ) : (
                    <p className="text-[12px] text-gray-500 leading-relaxed">No explanation available for this question.</p>
                  )}
                </div>
              )
            })}
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 flex gap-2 shrink-0">
        <button onClick={() => navigate('/')} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-[14px] text-gray-500">
          Home
        </button>
        <button onClick={() => navigate(`/configure/${session.upload_id}?difficulty=${session.difficulty}&count=${session.question_count}`)} className="flex-2 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-[14px] font-medium">
          Retake quiz
        </button>
      </div>
    </div>
  )
}

function normalizeExplanation(q) {
  const explanation = q?.explanation
  if (!explanation) return null
  if (typeof explanation === 'string') {
    return { correct: explanation }
  }
  if (typeof explanation === 'object' && !Array.isArray(explanation)) {
    const correct = typeof explanation.correct === 'string' ? explanation.correct : ''
    return { correct }
  }
  return null
}
