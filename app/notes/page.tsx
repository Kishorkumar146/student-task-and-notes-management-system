import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import NoteCard from "@/components/notes/note-card";
import Link from "next/link";
import { Plus, FileText, Pin } from "lucide-react";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const { subject: subjectId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let query = supabase
    .from("notes")
    .select("*, subject:subjects(id, name, color)")
    .eq("user_id", user.id)
    .eq("is_archived", false)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (subjectId) query = query.eq("subject_id", subjectId);

  const { data: notes } = await query;

  const pinned = notes?.filter((n) => n.is_pinned) ?? [];
  const rest = notes?.filter((n) => !n.is_pinned) ?? [];

  return (
    <DashboardLayout title="Notes">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Notes</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {notes?.length ?? 0} note{notes?.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/notes/create"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm"
          >
            <Plus size={16} />
            New Note
          </Link>
        </div>

        {!notes || notes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">No notes yet</h3>
            <p className="text-slate-400 text-sm mb-6">
              Create your first note to start capturing ideas.
            </p>
            <Link
              href="/notes/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all"
            >
              <Plus size={16} />
              Create Note
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pinned */}
            {pinned.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Pin size={13} className="text-indigo-500" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Pinned
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {pinned.map((note) => (
                    <NoteCard key={note.id} note={note as any} />
                  ))}
                </div>
              </div>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <div>
                {pinned.length > 0 && (
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
                    All Notes
                  </span>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {rest.map((note) => (
                    <NoteCard key={note.id} note={note as any} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}