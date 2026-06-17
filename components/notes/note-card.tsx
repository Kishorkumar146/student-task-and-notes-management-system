"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { Pin, Trash2, BookOpen } from "lucide-react";
import { deleteNote, togglePin } from "@/lib/actions/notes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content_text?: string;
    is_pinned: boolean;
    updated_at: string;
    subject?: { id: string; name: string; color: string } | null;
  };
}

const subjectColors: Record<string, string> = {
  indigo: "bg-indigo-100 text-indigo-700",
  violet: "bg-violet-100 text-violet-700",
  blue: "bg-blue-100 text-blue-700",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  rose: "bg-rose-100 text-rose-700",
  orange: "bg-orange-100 text-orange-700",
  teal: "bg-teal-100 text-teal-700",
};

export default function NoteCard({ note }: NoteCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${note.title}"?`)) return;
    setLoading(true);
    try {
      await deleteNote(note.id);
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  const handlePin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await togglePin(note.id, !note.is_pinned);
      router.refresh();
    } catch {}
  };

  const subject = Array.isArray(note.subject) ? note.subject[0] : note.subject;

  return (
    <Link href={`/notes/${note.id}`}>
      <div className={clsx(
        "bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full",
        "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
        loading && "opacity-50 pointer-events-none",
        note.is_pinned && "ring-1 ring-indigo-200"
      )}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 flex-1">
            {note.title || "Untitled"}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handlePin}
              className={clsx(
                "p-1.5 rounded-lg transition-colors",
                note.is_pinned
                  ? "text-indigo-500 bg-indigo-50 hover:bg-indigo-100"
                  : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"
              )}
            >
              <Pin size={12} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Preview */}
        {note.content_text ? (
          <p className="text-xs text-slate-400 line-clamp-3 mb-3 leading-relaxed">
            {note.content_text}
          </p>
        ) : (
          <p className="text-xs text-slate-300 italic mb-3">No content yet...</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
          {subject ? (
            <span className={clsx(
              "text-xs px-2 py-0.5 rounded-md font-medium",
              subjectColors[subject.color] ?? "bg-slate-100 text-slate-600"
            )}>
              {subject.name}
            </span>
          ) : (
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <BookOpen size={10} /> No subject
            </span>
          )}
          <span className="text-xs text-slate-400">
            {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
          </span>
        </div>
      </div>
    </Link>
  );
}