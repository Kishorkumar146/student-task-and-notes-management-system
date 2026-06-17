"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { FileText, CheckSquare, Trash2, Pencil } from "lucide-react";
import { deleteSubject } from "@/lib/actions/subjects";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SubjectCardProps {
  subject: {
    id: string;
    name: string;
    description?: string;
    color: string;
    icon?: string;
    notes?: { count: number }[];
    tasks?: { count: number }[];
  };
}

const colorMap: Record<string, { bg: string; light: string; text: string }> = {
  indigo: { bg: "bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-700" },
  violet: { bg: "bg-violet-500", light: "bg-violet-50", text: "text-violet-700" },
  blue: { bg: "bg-blue-500", light: "bg-blue-50", text: "text-blue-700" },
  emerald: { bg: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-700" },
  amber: { bg: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700" },
  rose: { bg: "bg-rose-500", light: "bg-rose-50", text: "text-rose-700" },
  orange: { bg: "bg-orange-500", light: "bg-orange-50", text: "text-orange-700" },
  teal: { bg: "bg-teal-500", light: "bg-teal-50", text: "text-teal-700" },
};

export default function SubjectCard({ subject }: SubjectCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const colors = colorMap[subject.color] ?? colorMap.indigo;
  const noteCount = subject.notes?.[0]?.count ?? 0;
  const taskCount = subject.tasks?.[0]?.count ?? 0;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${subject.name}"? This will also delete all its notes and tasks.`)) return;
    setDeleting(true);
    try {
      await deleteSubject(subject.id);
      router.refresh();
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className={clsx(
      "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden",
      "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
      deleting && "opacity-50 pointer-events-none"
    )}>
      {/* Top color bar */}
      <div className={clsx("h-1.5 w-full", colors.bg)} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center text-xl", colors.light)}>
              {subject.icon ?? "📚"}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">{subject.name}</h3>
              {subject.description && (
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{subject.description}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link
              href={`/subjects/${subject.id}`}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Pencil size={13} />
            </Link>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-4">
          <Link
            href={`/notes?subject=${subject.id}`}
            className={clsx(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
              colors.light, colors.text, "hover:opacity-80"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <FileText size={12} />
            {noteCount} {noteCount === 1 ? "note" : "notes"}
          </Link>
          <Link
            href={`/tasks?subject=${subject.id}`}
            className={clsx(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
              colors.light, colors.text, "hover:opacity-80"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <CheckSquare size={12} />
            {taskCount} {taskCount === 1 ? "task" : "tasks"}
          </Link>
        </div>
      </div>
    </div>
  );
}