"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNote, updateNote } from "@/lib/actions/notes";
import NoteEditor from "./note-editor";
import { Save, X, Sparkles, Send } from "lucide-react";

interface NoteFormProps {
  subjects: { id: string; name: string; color: string }[];
  defaultValues?: {
    id?: string;
    title?: string;
    content?: string;
    subject_id?: string;
  };
}

export default function NoteForm({ subjects, defaultValues }: NoteFormProps) {
  const router = useRouter();
  const isEdit = !!defaultValues?.id;

  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [content, setContent] = useState(defaultValues?.content ?? "");
  const [contentText, setContentText] = useState("");
  const [subjectId, setSubjectId] = useState(defaultValues?.subject_id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ask AI state
  const [aiOpen, setAiOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required"); return; }
    setLoading(true);
    setError("");

    try {
      if (isEdit && defaultValues?.id) {
        await updateNote(defaultValues.id, {
          title,
          content,
          content_text: contentText,
          subject_id: subjectId || undefined,
        });
        router.push(`/notes/${defaultValues.id}`);
      } else {
        const note = await createNote({
          title,
          content,
          content_text: contentText,
          subject_id: subjectId || undefined,
        });
        router.push(`/notes/${note.id}`);
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setAiLoading(true);
    setAiError("");
    setAnswer("");

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          noteTitle: title || "Untitled Note",
          noteContent: contentText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setAnswer(data.answer);
    } catch (err: any) {
      setAiError(err.message || "Failed to get a response");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <input
        type="text"
        className="w-full text-2xl font-bold text-slate-900 placeholder:text-slate-300 border-none outline-none bg-transparent"
        placeholder="Untitled Note"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Subject + Ask AI trigger */}
      <div className="flex items-center justify-between gap-3">
        <select
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        >
          <option value="">No Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setAiOpen((open) => !open)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 text-sm font-medium hover:bg-indigo-100 transition-all"
        >
          <Sparkles size={14} />
          Ask AI
        </button>
      </div>

      {/* Ask AI panel */}
      {aiOpen && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-3">
          <form onSubmit={handleAskAI} className="flex items-center gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
              placeholder="Ask something about this note..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              type="submit"
              disabled={aiLoading || !question.trim()}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {aiLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={14} />
              )}
            </button>
          </form>

          {aiError && (
            <p className="text-sm text-red-600">{aiError}</p>
          )}

          {answer && (
            <div className="bg-white rounded-lg border border-indigo-100 p-3">
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1.5">
                Answer
              </p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {answer}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="border-t border-slate-100 pt-4">
        <NoteEditor
          content={content || undefined}
          onChange={(json, text) => {
            setContent(json);
            setContentText(text);
          }}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
        >
          <X size={14} />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={14} />
          )}
          {isEdit ? "Save Changes" : "Create Note"}
        </button>
      </div>
    </form>
  );
}