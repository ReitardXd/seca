const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const MODEL = 'openai/gpt-oss-120b'

const ANGLES = [
  'Focus on characters and their motivations.',
  'Focus on themes and symbolism.',
  'Focus on plot events and timeline.',
  'Focus on quotes and specific scenes.',
  'Focus on philosophical ideas and deeper meaning.',
]

const parseQuestions = (raw, count) => {
  const cleaned = raw.replace(/```json|```/g, '').trim()

  let parsed
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    // Fall back to the outermost {...} in case the model added text around the JSON
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('No JSON object in model output')
    parsed = JSON.parse(cleaned.slice(start, end + 1))
  }

  const list = Array.isArray(parsed) ? parsed : parsed.questions
  if (!Array.isArray(list)) throw new Error('Missing questions array')

  const valid = list.filter(
    (q) =>
      q &&
      typeof q.question === 'string' &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.answer === 'string' &&
      q.options.includes(q.answer)
  )

  if (valid.length === 0) throw new Error('No valid questions in model output')
  return valid.slice(0, count)
}

const generateQuiz = async (bookTitle, author, topic, count = 5) => {
  const angle = ANGLES[Math.floor(Math.random() * ANGLES.length)]

  const prompt = `You are a quiz generator for a social reading app.

Generate exactly ${count} multiple choice questions about "${bookTitle}" by ${author}.
${topic ? `Focus on: ${topic}` : angle}
Make the questions varied and non-obvious. Avoid the most basic questions.

Return ONLY a JSON object of this exact shape, with no markdown and no explanation:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
      "answer": "A) option1"
    }
  ]
}
The "answer" value must be copied exactly from one of the four options.`

  let lastError
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await groq.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        reasoning_effort: 'low',
        max_completion_tokens: 8000,
        response_format: { type: 'json_object' },
      })

      const raw = response.choices?.[0]?.message?.content || ''
      return parseQuestions(raw, count)
    } catch (err) {
      lastError = err
      console.error(`Quiz generation attempt ${attempt} failed:`, err.message)
    }
  }

  throw new Error('Quiz generation failed — invalid JSON from model')
}

module.exports = { generateQuiz }
