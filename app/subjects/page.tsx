import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import SubjectCard from "@/components/subjects/subject-card";
import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";

export default async function SubjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: subjects } = await supabase
    .from("subjects")
    .select("*, notes(count), tasks(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <DashboardLayout title="Subjects">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Subjects</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {subjects?.length ?? 0} subject{subjects?.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/subjects/create"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm"
          >
            <Plus size={16} />
            New Subject
          </Link>
        </div>

        {/* Grid */}
        {!subjects || subjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">No subjects yet</h3>
            <p className="text-slate-400 text-sm mb-6">
              Create your first subject to organize your notes and tasks.
            </p>
            <Link
              href="/subjects/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all"
            >
              <Plus size={16} />
              Create Subject
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject as any} />
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}