import { GoogleGenAI } from "@google/genai";

interface AskGeminiParams {
  question: string;
  noteTitle?: string;
  noteContent?: string;
}

interface GeminiResponse {
  answer: string;
}

export async function askGemini({
  question,
  noteTitle,
  noteContent,
}: AskGeminiParams): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey });

  const contextBlock = noteContent
    ? `The user is reviewing a note titled "${noteTitle ?? "Untitled"}" with the following content:\n\n"""\n${noteContent}\n"""\n\n`
    : "";

  const prompt = `${contextBlock}You are a helpful study assistant. Use the note above as context if relevant, but you may also use your general knowledge to fully answer the question. Be clear and concise.\n\nQuestion: ${question}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const answer = response.text?.trim() ?? "Sorry, I couldn't generate a response.";
    return { answer };
  } catch (err: any) {
    throw new Error(`Gemini API error: ${err.message ?? String(err)}`);
  }
}