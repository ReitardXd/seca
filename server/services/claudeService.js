const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const generateQuiz = async (bookTitle, author, topic, count = 5) => {
  const angles = [
    'Focus on characters and their motivations.',
    'Focus on themes and symbolism.',
    'Focus on plot events and timeline.',
    'Focus on quotes and specific scenes.',
    'Focus on philosophical ideas and deeper meaning.',
  ]
  const randomAngle = angles[Math.floor(Math.random() * angles.length)]

  const prompt = `You are a quiz generator for a social reading app.

Generate ${count} multiple choice questions about "${bookTitle}" by ${author}.
${topic ? `Focus on: ${topic}` : randomAngle}
Make the questions varied and non-obvious. Avoid the most basic questions.

Return ONLY a valid JSON array, no markdown, no explanation, just the array.
Format:
[
  {
    "question": "Question text here?",
    "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
    "answer": "A) option1"
  }
]`

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 1.0,
    max_tokens: 4096,
  })

  const raw = response.choices[0].message.content.trim()
  const cleaned = raw.replace(/```json|```/g, '').trim()
 try {
  const questions = JSON.parse(cleaned)
  return questions
} catch (e) {
  console.error('Failed to parse quiz JSON:', cleaned)
  throw new Error('Quiz generation failed — invalid JSON from model')
} 
}

module.exports = { generateQuiz }
