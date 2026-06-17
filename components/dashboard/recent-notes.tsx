import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface Note {
  id: string;
  title: string;
  content?: string;
  created_at: string;
  subject?: Subject | Subject[] | null;
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

function getSubject(subject: Subject | Subject[] | null | undefined): Subject | null {
  if (!subject) return null;
  if (Array.isArray(subject)) return subject[0] ?? null;
  return subject;
}

export default function RecentNotes({ notes }: { notes: Note[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700">Recent Notes</h3>
        </div>
        <Link
          href="/notes"
          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      <div className="divide-y divide-slate-50">
        {notes.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <FileText size={32} className="text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No notes yet</p>
            <Link
              href="/notes/create"
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-1 inline-block"
            >
              Create your first note →
            </Link>
          </div>
        ) : (
          notes.map((note) => {
            const subject = getSubject(note.subject);
            return (
              <Link key={note.id} href={`/notes/${note.id}`}>
                <div className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {note.title || "Untitled"}
                      </p>
                      {note.content && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {note.content.slice(0, 80)}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      {subject && (
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${subjectColors[subject.color] ?? "bg-slate-100 text-slate-600"}`}>
                          {subject.name}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}