const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const generateQuiz = async (bookTitle, author, topic) => {
  const prompt = `You are a quiz generator for a social reading app.
  
Generate 5 multiple choice questions about "${bookTitle}" by ${author}.
${topic ? `Focus on: ${topic}` : 'Cover general themes, characters, and plot.'}

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
    temperature: 0.7,
    max_tokens: 1500,
  })

  const raw = response.choices[0].message.content.trim()

  // Strip markdown code blocks if present
  const cleaned = raw.replace(/```json|```/g, '').trim()

  const questions = JSON.parse(cleaned)
  return questions
}

module.exports = { generateQuiz }
