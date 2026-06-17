"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type ResultType = "task" | "note" | "subject";

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  subtitle?: string;
}

export default function SearchBar() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);

      const [tasksRes, notesRes, subjectsRes] = await Promise.all([
        supabase
          .from("tasks")
          .select("id, title, status")
          .ilike("title", `%${query}%`)
          .limit(5),
        supabase
          .from("notes")
          .select("id, title")
          .ilike("title", `%${query}%`)
          .limit(5),
        supabase
          .from("subjects")
          .select("id, name")
          .ilike("name", `%${query}%`)
          .limit(5),
      ]);

      const combined: SearchResult[] = [
        ...(tasksRes.data ?? []).map((t) => ({
          id: t.id,
          type: "task" as const,
          title: t.title,
          subtitle: t.status?.replace("_", " "),
        })),
        ...(notesRes.data ?? []).map((n) => ({
          id: n.id,
          type: "note" as const,
          title: n.title,
        })),
        ...(subjectsRes.data ?? []).map((s) => ({
          id: s.id,
          type: "subject" as const,
          title: s.name,
        })),
      ];

      setResults(combined);
      setOpen(true);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(result: SearchResult) {
    setOpen(false);
    setQuery("");
    if (result.type === "task") router.push(`/tasks/${result.id}`);
    if (result.type === "note") router.push(`/notes/${result.id}`);
    if (result.type === "subject") router.push(`/subjects/${result.id}`);
  }

  const typeLabel: Record<ResultType, string> = {
    task: "Task",
    note: "Note",
    subject: "Subject",
  };

  const typeColor: Record<ResultType, string> = {
    task: "bg-indigo-50 text-indigo-600",
    note: "bg-amber-50 text-amber-600",
    subject: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search tasks, notes, subjects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden max-h-80 overflow-y-auto">
          {loading ? (
            <p className="px-4 py-3 text-sm text-slate-500">Searching...</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-500">No results found</p>
          ) : (
            results.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleSelect(result)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
              >
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${typeColor[result.type]}`}
                >
                  {typeLabel[result.type]}
                </span>
                <span className="text-sm text-slate-900 truncate">
                  {result.title}
                </span>
                {result.subtitle && (
                  <span className="text-xs text-slate-400 ml-auto capitalize">
                    {result.subtitle}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
