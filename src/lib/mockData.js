/*
 * Mock data & API interceptor for demo mode.
 * When no real backend is available, this provides realistic data
 * so the entire UI can be explored.
 */

// ── Mock User ──
export const MOCK_USER = {
  id: 1,
  first_name: 'Jamie',
  last_name: 'Doe',
  email: 'jamie@example.com',
}

// ── Mock Uploads ──
export const MOCK_UPLOADS = [
  {
    id: 'upload-1',
    original_name: 'Biology Chapter 4.pdf',
    file_type: 'pdf',
    page_count: 18,
    quiz_count: 3,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'upload-2',
    original_name: 'Marketing Strategy Q3.pptx',
    file_type: 'pptx',
    page_count: 42,
    quiz_count: 1,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'upload-3',
    original_name: 'Research Paper Draft.docx',
    file_type: 'docx',
    page_count: 8,
    quiz_count: 2,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
]

// ── Mock Questions ──
export const MOCK_QUESTIONS = [
  {
    id: 1,
    question: 'Which organelle is primarily responsible for producing ATP through cellular respiration in eukaryotic cells?',
    options: ['Nucleus', 'Endoplasmic reticulum', 'Mitochondria', 'Golgi apparatus'],
    correct_answer: 'Mitochondria',
    difficulty: 'Medium',
    explanation: 'Known as the "powerhouse of the cell," mitochondria generate most of the cell\'s supply of ATP through oxidative phosphorylation during cellular respiration.',
  },
  {
    id: 2,
    question: 'What is the primary function of ribosomes in a cell?',
    options: ['DNA replication', 'Protein synthesis', 'Lipid metabolism', 'Cell division'],
    correct_answer: 'Protein synthesis',
    difficulty: 'Easy',
    explanation: 'Ribosomes are the cellular machinery responsible for translating mRNA sequences into polypeptide chains (proteins).',
  },
  {
    id: 3,
    question: 'During which phase of mitosis do chromosomes align at the cell\'s equatorial plate?',
    options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
    correct_answer: 'Metaphase',
    difficulty: 'Medium',
    explanation: 'During metaphase, chromosomes line up along the metaphase plate (equatorial plane) of the cell, attached to spindle fibers at their centromeres.',
  },
  {
    id: 4,
    question: 'Which molecule serves as the primary energy currency of the cell?',
    options: ['GDP', 'ATP', 'ADP', 'GTP'],
    correct_answer: 'ATP',
    difficulty: 'Easy',
    explanation: 'Adenosine triphosphate (ATP) is the primary energy carrier in all living organisms. The energy stored in its phosphate bonds is used to power cellular processes.',
  },
  {
    id: 5,
    question: 'What is the role of the cell membrane\'s phospholipid bilayer?',
    options: [
      'Energy production',
      'Selective permeability barrier',
      'Protein synthesis',
      'Genetic information storage',
    ],
    correct_answer: 'Selective permeability barrier',
    difficulty: 'Medium',
    explanation: 'The phospholipid bilayer acts as a semi-permeable barrier, allowing certain molecules to pass while blocking others, maintaining cellular homeostasis.',
  },
  {
    id: 6,
    question: 'Which type of RNA carries amino acids to the ribosome during translation?',
    options: ['mRNA', 'tRNA', 'rRNA', 'snRNA'],
    correct_answer: 'tRNA',
    difficulty: 'Easy',
    explanation: 'Transfer RNA (tRNA) carries specific amino acids to the ribosome, matching them to the codons on the mRNA template during protein synthesis.',
  },
  {
    id: 7,
    question: 'The process by which cells engulf large particles or other cells is called:',
    options: ['Pinocytosis', 'Exocytosis', 'Phagocytosis', 'Osmosis'],
    correct_answer: 'Phagocytosis',
    difficulty: 'Medium',
    explanation: 'Phagocytosis ("cell eating") is a form of endocytosis where cells surround and engulf large particles, bacteria, or dead cells using pseudopods.',
  },
  {
    id: 8,
    question: 'Which checkpoint in the cell cycle primarily monitors DNA damage before replication?',
    options: ['G1/S checkpoint', 'G2/M checkpoint', 'Metaphase checkpoint', 'S phase checkpoint'],
    correct_answer: 'G1/S checkpoint',
    difficulty: 'Hard',
    explanation: 'The G1/S checkpoint (restriction point) ensures the cell\'s DNA is intact before committing to S phase (DNA synthesis). If damage is detected, the cell cycle is halted for repair.',
  },
  {
    id: 9,
    question: 'What is the final electron acceptor in the electron transport chain?',
    options: ['NADH', 'FADH2', 'Oxygen', 'Carbon dioxide'],
    correct_answer: 'Oxygen',
    difficulty: 'Hard',
    explanation: 'Molecular oxygen (O₂) is the final electron acceptor in the electron transport chain. It combines with electrons and hydrogen ions to form water (H₂O).',
  },
  {
    id: 10,
    question: 'In plant cells, which organelle is responsible for photosynthesis?',
    options: ['Mitochondria', 'Chloroplast', 'Vacuole', 'Peroxisome'],
    correct_answer: 'Chloroplast',
    difficulty: 'Easy',
    explanation: 'Chloroplasts contain chlorophyll and are the site of photosynthesis, converting light energy, CO₂, and water into glucose and oxygen.',
  },
]

// ── Mock Sessions (History) ──
export const MOCK_SESSIONS = [
  {
    id: 'session-1',
    upload_id: 'upload-1',
    upload_name: 'Biology Chapter 4.pdf',
    file_type: 'pdf',
    question_count: 10,
    difficulty: 'medium',
    score: 80,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'session-2',
    upload_id: 'upload-2',
    upload_name: 'Marketing Strategy Q3.pptx',
    file_type: 'pptx',
    question_count: 10,
    difficulty: 'easy',
    score: 60,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'session-3',
    upload_id: 'upload-1',
    upload_name: 'Biology Chapter 4.pdf',
    file_type: 'pdf',
    question_count: 5,
    difficulty: 'hard',
    score: 100,
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
]

// ── Install mock interceptors on an axios instance ──
export function installMockInterceptors(api) {
  api.interceptors.request.use(async (config) => {
    // Simulate network latency
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 400))

    const { url, method, data } = config
    let mockResponse = null

    // ── Auth ──
    if (url === '/auth/login' && method === 'post') {
      mockResponse = { token: 'mock-jwt-token', user: MOCK_USER }
    }
    if (url === '/auth/register' && method === 'post') {
      const body = typeof data === 'string' ? JSON.parse(data) : data
      mockResponse = {
        token: 'mock-jwt-token',
        user: { ...MOCK_USER, first_name: body.firstName || 'New', last_name: body.lastName || 'User', email: body.email },
      }
    }
    if (url === '/auth/me' && method === 'get') {
      mockResponse = { user: MOCK_USER }
    }

    // ── Uploads ──
    if (url === '/upload/recent' && method === 'get') {
      mockResponse = { uploads: MOCK_UPLOADS }
    }
    if (url?.match(/^\/upload\/[\w-]+$/) && method === 'get') {
      const id = url.split('/').pop()
      mockResponse = { upload: MOCK_UPLOADS.find((u) => u.id === id) || MOCK_UPLOADS[0] }
    }
    if (url === '/upload' && method === 'post') {
      mockResponse = { uploadId: 'upload-1' }
    }

    // ── Quiz ──
    if (url === '/quiz/generate' && method === 'post') {
      mockResponse = { sessionId: 'session-new' }
    }
    if (url?.match(/^\/quiz\/session\//) && method === 'get') {
      mockResponse = {
        session: {
          id: 'session-new',
          upload_id: 'upload-1',
          upload_name: 'Biology Chapter 4.pdf',
          config: { answerMode: 'immediate' },
        },
        questions: MOCK_QUESTIONS,
      }
    }
    if (url === '/quiz/answer' && method === 'post') {
      mockResponse = { success: true }
    }
    if (url?.match(/^\/quiz\/results\//) && method === 'get') {
      mockResponse = {
        session: { id: 'session-1', upload_id: 'upload-1', upload_name: 'Biology Chapter 4.pdf' },
        questions: MOCK_QUESTIONS,
        answers: MOCK_QUESTIONS.map((q, i) => ({
          question_id: q.id,
          selected_answer: i < 8 ? q.correct_answer : q.options[0],
          is_correct: i < 8,
        })),
      }
    }
    if (url === '/quiz/history' && method === 'get') {
      mockResponse = { sessions: MOCK_SESSIONS }
    }

    if (mockResponse) {
      // Abort the real request and return mock data
      const error = new Error('MOCK')
      error.__MOCK_RESPONSE__ = { data: mockResponse, status: 200 }
      throw error
    }

    return config
  })

  // Intercept the mock "error" and turn it into a successful response
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.message === 'MOCK' && err.__MOCK_RESPONSE__) {
        return Promise.resolve(err.__MOCK_RESPONSE__)
      }
      return Promise.reject(err)
    }
  )
}
