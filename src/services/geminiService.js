import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function summarizeText(text) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const prompt = `
  Summarize the following text into 3-6 bullet points:

  ${text}
  `

  const result = await model.generateContent(prompt)

  return result.response.text()
}