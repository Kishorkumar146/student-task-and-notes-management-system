import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { askGemini } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError || !userData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { question, noteTitle, noteContent } = body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const { answer } = await askGemini({
      question: question.trim(),
      noteTitle,
      noteContent,
    });

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Gemini route error:", error);
    return NextResponse.json(
      { error: "Failed to get a response from the assistant" },
      { status: 500 }
    );
  }
}