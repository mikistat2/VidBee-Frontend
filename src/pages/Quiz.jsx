import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePlatform } from '../hooks/usePlatform'
import api from '../lib/api'

export default function QuizPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { isMobile } = usePlatform()
  const [session, setSession] = useState(null)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState({})
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    api.get(`/quiz/session/${sessionId}`).then(r => {
      setSession(r.data.session)
      setQuestions(r.data.questions)
    }).catch(() => navigate('/'))
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [sessionId])

  if (!session || questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading quiz…</p>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const totalQ = questions.length
  const answerMode = session.config?.answerMode || 'immediate'
  const selectedAnswer = answers[q.id]
  const isRevealed = answerMode === 'immediate' ? !!selectedAnswer : !!revealed[q.id]
  const correctCount = Object.entries(answers).filter(([id, ans]) => {
    const qq = questions.find(x => x.id === Number(id))
    return qq && ans === qq.correct_answer
  }).length
  const wrongCount = Object.keys(answers).length - correctCount
  const accuracy = Object.keys(answers).length > 0 ? Math.round((correctCount / Object.keys(answers).length) * 100) : 0

  const timer = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  const selectAnswer = async (opt) => {
    if (selectedAnswer) return
    const newAnswers = { ...answers, [q.id]: opt }
    setAnswers(newAnswers)
    if (answerMode === 'immediate') {
      setRevealed(r => ({ ...r, [q.id]: true }))
    }
    await api.post(`/quiz/answer`, { sessionId, questionId: q.id, answer: opt }).catch(() => { })
  }

  const nextQuestion = () => {
    if (current < totalQ - 1) {
      setCurrent(c => c + 1)
    } else {
      clearInterval(timerRef.current)
      navigate(`/results/${sessionId}`)
    }
  }

  const skipQuestion = () => {
    nextQuestion()
  }

  const props = { q, questions, current, totalQ, answers, selectedAnswer, isRevealed, answerMode, correctCount, wrongCount, accuracy, timer, session, selectAnswer, nextQuestion, skipQuestion, navigate }

  return isMobile ? <MobileQuiz {...props} /> : <WebQuiz {...props} />
}

/* ─── Web Quiz ─── */
function WebQuiz({ q, questions, current, totalQ, answers, selectedAnswer, isRevealed, answerMode, correctCount, wrongCount, accuracy, timer, session, selectAnswer, nextQuestion, skipQuestion, navigate }) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Topbar */}
      <div className="bg-white border-b border-black/8 px-7 h-[56px] flex items-center justify-between shrink-0">
        <span className="text-[15px] text-gray-400 truncate max-w-55">{session.upload_name}</span>
        <span className="text-[16px] text-gray-500">
          Question <span className="font-medium text-gray-900">{current + 1}</span> of <span className="font-medium text-gray-900">{totalQ}</span>
        </span>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full border border-gray-200 text-[14px] font-medium">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 2" />
          </svg>
          {timer}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar */}
        <aside className="w-55 shrink-0 border-r border-black/8 bg-white flex flex-col">
          {/* Progress */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between mb-2">
              <span className="text-[13px] text-gray-400">Progress</span>
              <span className="text-[13px] font-medium">{Object.keys(answers).length} / {totalQ}</span>
            </div>
            <div className="h-1 bg-gray-100 rounded-full mb-3">
              <div
                className="h-1 bg-gray-900 rounded-full transition-all"
                style={{ width: `${(Object.keys(answers).length / totalQ) * 100}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {questions.map((qq, i) => {
                const ans = answers[qq.id]
                const isCorrect = ans && ans === qq.correct_answer
                const isWrong = ans && ans !== qq.correct_answer
                return (
                  <div
                    key={qq.id}
                    className={`w-5.5 h-5.5 rounded-md flex items-center justify-center text-[10px] font-medium border ${i === current ? 'bg-gray-900 text-white border-gray-900'
                        : isCorrect ? 'bg-green-50 text-green-700 border-green-300'
                          : isWrong ? 'bg-red-50 text-red-600 border-red-300'
                            : 'border-gray-200 text-gray-400'
                      }`}
                  >
                    {i + 1}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Score */}
          <div className="p-4 flex-1">
            <p className="text-[13px] uppercase tracking-[0.8px] text-gray-400 mb-4">Score so far</p>
            {[
              { label: 'Correct', val: correctCount, color: 'text-green-700' },
              { label: 'Wrong', val: wrongCount, color: 'text-red-600' },
              { label: 'Skipped', val: totalQ - Object.keys(answers).length - (current - Object.keys(answers).length + 1 > 0 ? 0 : 0), color: 'text-gray-500' },
            ].map(r => (
              <div key={r.label} className="flex justify-between mb-2.5">
                <span className="text-[15px] text-gray-400">{r.label}</span>
                <span className={`text-[15px] font-medium ${r.color}`}>{r.val}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-2 border-t border-gray-100">
              <span className="text-[15px] text-gray-400">Accuracy</span>
              <span className="text-[15px] font-medium">{accuracy}%</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 overflow-y-auto p-7 scrollbar-thin">
          <QuestionCard q={q} current={current} totalQ={totalQ} />
          <AnswerOptions q={q} selectedAnswer={selectedAnswer} isRevealed={isRevealed} selectAnswer={selectAnswer} />
          {isRevealed && <ExplanationCard q={q} selectedAnswer={selectedAnswer} />}
          <ActionRow selectedAnswer={selectedAnswer} current={current} totalQ={totalQ} nextQuestion={nextQuestion} skipQuestion={skipQuestion} />
        </div>
      </div>
    </div>
  )
}

/* ─── Mobile Quiz ─── */
function MobileQuiz({ q, questions, current, totalQ, answers, selectedAnswer, isRevealed, timer, correctCount, wrongCount, selectAnswer, nextQuestion, skipQuestion, navigate }) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Topbar */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between border-b border-gray-100 shrink-0">
        <span className="text-[13px] text-gray-400">Question {current + 1} of {totalQ}</span>
        <span className="text-[13px] font-medium">{timer}</span>
      </div>

      {/* Progress bar */}
      <div className="h-0.75 bg-gray-100 shrink-0">
        <div
          className="h-0.75 bg-gray-900 transition-all"
          style={{ width: `${((current + 1) / totalQ) * 100}%` }}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <QuestionCard q={q} current={current} totalQ={totalQ} mobile />
        <AnswerOptions q={q} selectedAnswer={selectedAnswer} isRevealed={isRevealed} selectAnswer={selectAnswer} mobile />
        {isRevealed && <ExplanationCard q={q} selectedAnswer={selectedAnswer} mobile />}
      </div>

      <div className="p-4 border-t border-gray-100 flex gap-2 shrink-0">
        {!selectedAnswer && (
          <button onClick={skipQuestion} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-[14px] text-gray-500">
            Skip
          </button>
        )}
        <button
          onClick={nextQuestion}
          disabled={!selectedAnswer}
          className="flex-2 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-[14px] font-medium disabled:opacity-40"
        >
          {current === totalQ - 1 ? 'Finish quiz' : 'Next →'}
        </button>
      </div>
    </div>
  )
}

/* ─── Shared Components ─── */
function QuestionCard({ q, current, totalQ, mobile }) {
  return (
    <div className={`bg-gray-50 border border-gray-100 rounded-xl ${mobile ? 'p-4' : 'p-7 mb-5'}`}>
      <p className={`text-gray-400 mb-2.5 ${mobile ? 'text-[12px]' : 'text-[14px]'}`}>
        Question {current + 1} of {totalQ} · {q.difficulty || 'Medium'}
      </p>
      <p className={`font-medium text-gray-900 leading-relaxed ${mobile ? 'text-[15px]' : 'text-[19px]'}`}>
        {q.question}
      </p>
    </div>
  )
}

function AnswerOptions({ q, selectedAnswer, isRevealed, selectAnswer, mobile }) {
  const options = q.options || []
  const letters = ['A', 'B', 'C', 'D']

  return (
    <div className={`space-y-2 ${mobile ? '' : 'mb-4'}`}>
      {options.map((opt, i) => {
        const isSelected = selectedAnswer === opt
        const isCorrect = isRevealed && opt === q.correct_answer
        const isWrong = isRevealed && isSelected && opt !== q.correct_answer

        return (
          <button
            key={i}
            onClick={() => selectAnswer(opt)}
            disabled={!!selectedAnswer}
            className={`w-full flex items-start gap-3 text-left rounded-xl border transition-all ${mobile ? 'p-3' : 'p-4'
              } ${isCorrect ? 'border-green-400 bg-green-50'
                : isWrong ? 'border-red-400 bg-red-50'
                  : isSelected ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50'
              } disabled:cursor-default`}
          >
            <div className={`rounded-lg border flex items-center justify-center shrink-0 font-medium ${mobile ? 'w-5 h-5 text-[10px]' : 'w-6.5 h-6.5 text-[12px]'
              } ${isCorrect ? 'bg-green-500 text-white border-green-500'
                : isWrong ? 'bg-red-500 text-white border-red-500'
                  : isSelected ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-gray-200 text-gray-400'
              }`}>
              {letters[i]}
            </div>
            <span className={`${mobile ? 'text-[13px]' : 'text-[15px]'} ${isCorrect ? 'text-green-800 font-medium'
                : isWrong ? 'text-red-700'
                  : 'text-gray-700'
              } leading-relaxed pt-0.5`}>
              {opt}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function ExplanationCard({ q, selectedAnswer, mobile }) {
  const isCorrect = selectedAnswer === q.correct_answer
  const explanation = q.explanation

  const normalized = (() => {
    if (!explanation) return null
    if (typeof explanation === 'string') {
      return { correct: explanation }
    }
    if (typeof explanation === 'object' && !Array.isArray(explanation)) {
      return {
        correct: typeof explanation.correct === 'string' ? explanation.correct : '',
      }
    }
    return null
  })()

  return (
    <div className={`rounded-xl border ${mobile ? 'p-3' : 'p-5 mb-4'} ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      }`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${isCorrect
            ? 'bg-green-100 text-green-800 border-green-300'
            : 'bg-red-100 text-red-800 border-red-300'
          }`}>
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </span>
        {!isCorrect && (
          <span className={`${mobile ? 'text-[13px]' : 'text-[14px]'} font-medium text-gray-700`}>
            You selected: {selectedAnswer}
          </span>
        )}
      </div>

      <div className={`${mobile ? 'text-[12px]' : 'text-[17px]'} text-gray-600 leading-relaxed space-y-2`}>
        {!isCorrect && (
          <p>
            <span className="font-medium text-gray-800">Correct answer: {q.correct_answer}. </span>
          </p>
        )}

        {normalized?.correct ? (
          <p>{normalized.correct}</p>
        ) : (
          <p className="text-gray-500">No explanation available for this question.</p>
        )}

      </div>
    </div>
  )
}

function ActionRow({ selectedAnswer, current, totalQ, nextQuestion, skipQuestion }) {
  return (
    <div className="flex gap-2.5">
      {!selectedAnswer && (
        <button onClick={skipQuestion} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-[15px] text-gray-500 hover:bg-gray-50">
          Skip
        </button>
      )}
      <button
        onClick={nextQuestion}
        disabled={!selectedAnswer}
        className="flex-2 py-2.5 bg-[#1a1a1a] text-white rounded-lg text-[15px] font-medium disabled:opacity-40 hover:bg-[#333]"
      >
        {current === totalQ - 1 ? 'Finish quiz →' : 'Next question →'}
      </button>
    </div>
  )
}
