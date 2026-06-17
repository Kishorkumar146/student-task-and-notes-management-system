"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSubject, updateSubject } from "@/lib/actions/subjects";
import { SubjectColor } from "@/types/subject";
import { clsx } from "clsx";
import { BookOpen } from "lucide-react";

const COLORS: { value: SubjectColor; label: string; classes: string }[] = [
  { value: "indigo", label: "Indigo", classes: "bg-indigo-500" },
  { value: "violet", label: "Violet", classes: "bg-violet-500" },
  { value: "blue", label: "Blue", classes: "bg-blue-500" },
  { value: "emerald", label: "Emerald", classes: "bg-emerald-500" },
  { value: "amber", label: "Amber", classes: "bg-amber-500" },
  { value: "rose", label: "Rose", classes: "bg-rose-500" },
  { value: "orange", label: "Orange", classes: "bg-orange-500" },
  { value: "teal", label: "Teal", classes: "bg-teal-500" },
];

const ICONS = ["📚", "🔬", "🧮", "💻", "🎨", "🌍", "⚗️", "📐", "🎵", "🏛️", "📝", "🔭"];

interface SubjectFormProps {
  defaultValues?: {
    id?: string;
    name?: string;
    description?: string;
    color?: SubjectColor;
    icon?: string;
  };
}

export default function SubjectForm({ defaultValues }: SubjectFormProps) {
  const router = useRouter();
  const isEdit = !!defaultValues?.id;

  const [name, setName] = useState(defaultValues?.name ?? "");
  const [description, setDescription] = useState(defaultValues?.description ?? "");
  const [color, setColor] = useState<SubjectColor>(defaultValues?.color ?? "indigo");
  const [icon, setIcon] = useState(defaultValues?.icon ?? "📚");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isEdit && defaultValues?.id) {
        await updateSubject(defaultValues.id, { name, description, color, icon });
      } else {
        await createSubject({ name, description, color, icon });
      }
      router.push("/subjects");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Preview */}
      <div className="flex items-center justify-center py-6">
        <div className={clsx(
          "w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-lg",
          `bg-${color}-500`
        )}>
          {icon}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Subject Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
          placeholder="e.g. Mathematics, Physics..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none"
          placeholder="What is this subject about?"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Icon */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">Icon</label>
        <div className="grid grid-cols-6 gap-2">
          {ICONS.map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => setIcon(em)}
              className={clsx(
                "h-10 rounded-lg text-xl flex items-center justify-center border-2 transition-all",
                icon === em
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-transparent bg-slate-50 hover:bg-slate-100"
              )}
            >
              {em}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setColor(c.value)}
              className={clsx(
                "w-8 h-8 rounded-full transition-all",
                c.classes,
                color === c.value
                  ? "ring-2 ring-offset-2 ring-slate-400 scale-110"
                  : "hover:scale-105"
              )}
              title={c.label}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <BookOpen size={14} />
              {isEdit ? "Update Subject" : "Create Subject"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}