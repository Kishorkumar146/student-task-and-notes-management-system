const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

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

  const contextBlock = noteContent
    ? `The user is reviewing a note titled "${noteTitle ?? "Untitled"}" with the following content:\n\n"""\n${noteContent}\n"""\n\n`
    : "";

  const prompt = `${contextBlock}You are a helpful study assistant. Use the note above as context if relevant, but you may also use your general knowledge to fully answer the question. Be clear and concise.\n\nQuestion: ${question}`;

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  const answer: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
    "Sorry, I couldn't generate a response.";

  return { answer };
}